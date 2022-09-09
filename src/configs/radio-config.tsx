import { SerialConnection } from "../modules/connection-manager/serial/serial-connection";
import { Transport } from "../modules/connection-manager/types";
import { TransferEmitter } from "../utils/transfer-emitter";

export type BrandModelRevision = [string, string, number];

export interface RadioDefinition {
    identifiers: BrandModelRevision[];
    transport: Transport;
    image?: string;

    get factory(): any;

    // for serial radios
    serialOptions?: SerialOptions;
}

export interface BaseRadio {
    transport: Transport;

    downloadCodeplug(emitter?: TransferEmitter) : void;
    uploadCodeplug(emitter?: TransferEmitter) : void;
};

export abstract class SerialRadio implements BaseRadio {
    transport = Transport.SERIAL;
    connection: SerialConnection;

    constructor(connection: SerialConnection) {
        this.connection = connection;
    }

    abstract downloadCodeplug(emitter?: TransferEmitter): void;
    
    abstract uploadCodeplug(emitter?: TransferEmitter): void;
}