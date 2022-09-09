import events from "events";
import { SerialConnectionInterface, Transport } from "../types";

const POLL_INTERVAL = 250;

const log = (...args: any[]) => console.log('[SerialConnection]', ...args);

function concatenate(resultConstructor: any, ...arrays: any[]) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new resultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

export declare interface SerialConnection {
    on(event: 'open', listener: (self: SerialConnection) => void): this;
    on(event: 'error', listener: (error: DOMException) => void): this;
    on(event: 'disconnect', listener: () => void): this;
}

export class SerialConnection extends events.EventEmitter implements SerialConnectionInterface {
    type = Transport.SERIAL;

    index: number;
    port: SerialPort;
    options: SerialOptions;

    keepReading: boolean = false;
    reader: ReadableStreamDefaultReader<any> | null = null;
    buffer: Uint8Array = new Uint8Array();
    

    constructor(index: number, port: SerialPort, options: SerialOptions) {
        super();
        this.index = index;
        this.port = port;
        this.options = options;
        
        this.port.ondisconnect = () => this.emit('disconnect');
    }

    async open() {
        try {
            await this.port.open(this.options);
            this.keepReading = true;
            this.readTask();
            log('Port opened');
            this.emit('open', this);
        } catch (e) {
            log('Failed while opening port');
            this.emit('error', e);
            throw e;
        }
    }

    async close() {
        log('closing port');
        this.keepReading = false;
        await this.reader?.cancel();
        await this.port.close();
    }

    async write(data: Uint8Array): Promise<void> {
        log('writing data:', data);
        // todo remove this clear
        this.buffer = new Uint8Array();
        if (this.port.writable) {    
            const writer = this.port.writable.getWriter()     
            await writer.write(data);
            writer.releaseLock();
            log('data writen');
        }
        return;
    }

    async read(length?: number, timeout? : number): Promise<Uint8Array> {
        const haveEnoughBytes = this.buffer.length >= (length ?? 1);

        if (haveEnoughBytes) {
            return Promise.resolve(this.readBytesFromBuffer(length));
        } 
        
        if (!haveEnoughBytes && timeout === undefined) {
            return Promise.reject(new Error('not enough data'));
        }

        return new Promise((resolve, reject) => {
            function poll(cls: SerialConnection, elapsedTime: number) {                
                return () => {
                    log(`polling for data -> timePast: ${elapsedTime} of ${timeout}`);

                    cls.read(length).then((result: Uint8Array) => {
                        resolve(result);
                        return;
                    }, () => {});

                    if (elapsedTime >= (timeout ?? 1000)) {
                        reject(new Error('timeout'));
                        return;
                    }

                    setTimeout(poll(cls, elapsedTime + POLL_INTERVAL), POLL_INTERVAL);
                }                
            };

            setTimeout(poll(this, 0), POLL_INTERVAL);
        });
    }

    private readBytesFromBuffer(length?: number) : Uint8Array {
        length = length ?? this.buffer.length;
        const result = this.buffer.slice(0, length);
        
        if (length <= this.buffer.length) {
            this.buffer = this.buffer.slice(length, this.buffer.length);
        } else {
            this.buffer = new Uint8Array();
        }
        
        return result;
    }

    private async readTask(): Promise<void> {
        log('initiating read loop');
        while (this.port.readable && this.keepReading) {
            this.reader = this.port.readable.getReader();
            try {
                while (true) {
                    log('pre blocking read');
                    const { value, done } = await this.reader.read();
                    log('post blocking read', value, done);
                    if (done) {
                        // |reader| has been canceled.
                        log('reader has been canceled');
                        break;
                    }
                    log(`incoming ${value.length}`);
                    this.buffer = concatenate(Uint8Array, this.buffer, value);
                }
            } catch (error) {
                log('error while reading from serial port: ', error);
            } finally {
                this.reader.releaseLock();
            }
        }
    }
}