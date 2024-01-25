import events from "events";
import getLogger from "../../../../utils/logger";
import { SerialConnectionInterface } from "./serial";
import { Transport } from "../../base";

const POLL_INTERVAL = 250;

const logger = getLogger("SerialConnection");

function concatenate(...arrays: Uint8Array[]) {
  let totalLength = 0;
  for (let i = 0; i < arrays.length; i += 1) {
    totalLength += arrays[i].length;
  }
  // eslint-disable-next-line new-cap
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (let i = 0; i < arrays.length; i += 1) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return result;
}

export default class SerialConnection extends events.EventEmitter implements SerialConnectionInterface {
  type = Transport.SERIAL;

  index: number;

  port: SerialPort;

  options: SerialOptions;

  keepReading: boolean = false;

  reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  buffer: Uint8Array = new Uint8Array();

  constructor(index: number, port: SerialPort, options: SerialOptions) {
    super();
    this.index = index;
    this.port = port;
    this.options = options;

    this.port.ondisconnect = () => this.emit("disconnect");
  }

  async open() {
    try {
      await this.port.open(this.options);
      this.keepReading = true;
      this.readTask();
      logger.log("Port opened");
      this.emit("open", this);
    } catch (e) {
      logger.error("Failed while opening port");
      this.emit("error", e);
      throw e;
    }
  }

  async close() {
    logger.log("closing port");
    this.keepReading = false;
    await this.reader?.cancel();
    await this.port.close();
  }

  async write(data: Uint8Array): Promise<void> {
    logger.info("writing data:", data);
    // todo remove this clear
    this.buffer = new Uint8Array();
    if (this.port.writable) {
      const writer = this.port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      logger.info("data writen");
    }
  }

  async read(length?: number, timeout?: number): Promise<Uint8Array> {
    const haveEnoughBytes = this.buffer.length >= (length ?? 1);

    if (haveEnoughBytes) {
      return Promise.resolve(this.readBytesFromBuffer(length));
    }

    if (!haveEnoughBytes && timeout === undefined) {
      return Promise.reject(new Error("not enough data"));
    }

    return new Promise((resolve, reject) => {
      function poll(cls: SerialConnection, elapsedTime: number) {
        return () => {
          logger.debug(`polling for data -> timePast: ${elapsedTime} of ${timeout}`);

          cls.read(length).then(
            (result: Uint8Array) => {
              resolve(result);
            },
            () => {},
          );

          if (elapsedTime >= (timeout ?? 1000)) {
            reject(new Error("timeout"));
            return;
          }

          setTimeout(poll(cls, elapsedTime + POLL_INTERVAL), POLL_INTERVAL);
        };
      }

      setTimeout(poll(this, 0), POLL_INTERVAL);
    });
  }

  private readBytesFromBuffer(desiredLength?: number): Uint8Array {
    const length = desiredLength ?? this.buffer.length;
    const result = this.buffer.slice(0, length);

    if (length <= this.buffer.length) {
      this.buffer = this.buffer.slice(length, this.buffer.length);
    } else {
      this.buffer = new Uint8Array();
    }

    return result;
  }

  private async readTask(): Promise<void> {
    logger.debug("initiating read loop");
    while (this.port.readable && this.keepReading) {
      this.reader = this.port.readable.getReader();
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          logger.debug("pre blocking read");
          const { value, done } = await this.reader.read();
          logger.debug("post blocking read", value, done);
          if (done) {
            // |reader| has been canceled.
            logger.debug("reader has been canceled");
            break;
          }
          logger.debug(`incoming ${value.length}`);
          this.buffer = concatenate(this.buffer, value);
        }
      } catch (error) {
        logger.error("error while reading from serial port: ", error);
      } finally {
        this.reader.releaseLock();
      }
    }
  }
}
