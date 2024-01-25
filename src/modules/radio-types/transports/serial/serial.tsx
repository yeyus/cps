import { TransferEmitter } from "../../../../utils/transfer-emitter";
import { BaseRadioInterface, Transport } from "../../base";

export declare interface SerialConnectionInterface {
  index: number;
  port: SerialPort;
  options: SerialOptions;

  on(event: "open", listener: (self: SerialConnectionInterface) => void): this;
  on(event: "error", listener: (error: DOMException) => void): this;
  on(event: "disconnect", listener: () => void): this;
  open(): Promise<void>;
  close(): Promise<void>;
  write(data: Uint8Array): Promise<void>;
  read(length?: number, timeout?: number): Promise<Uint8Array>;
}

export abstract class SerialRadio implements BaseRadioInterface {
  transport = Transport.SERIAL;

  connection: SerialConnectionInterface;

  constructor(connection: SerialConnectionInterface) {
    this.connection = connection;
  }

  abstract downloadCodeplug(emitter?: TransferEmitter): void;

  abstract uploadCodeplug(emitter?: TransferEmitter): void;
}
