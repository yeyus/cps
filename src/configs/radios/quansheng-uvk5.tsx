import { Transport } from "../../modules/connection-manager/types";
import { TransferEmitter } from "../../utils/transfer-emitter";
import { RadioDefinition, SerialRadio } from "../radio-config";

import image from './images/quanshenk-uvk5-photo.png';

const log = (...args: any[]) => console.log('[QuanshengUVK5]', ...args);

const XOR_KEY = new Uint8Array([
    0x16, 0x6c, 0x14, 0xe6, 0x2e, 0x91, 0x0d, 0x40,
    0x21, 0x35, 0xd5, 0x40, 0x13, 0x03, 0xe9, 0x80
]);

const xor = (data: Uint8Array) => {
    const dataCopy = new Uint8Array(data)
    dataCopy.forEach((_, index, array) => array[index] ^= XOR_KEY[index % XOR_KEY.length]);
    return dataCopy;
}

function crc16xmodem(data: Uint8Array, crc = 0): number {
    const poly = 0x1021;

    for (let i = 0; i < data.length; i++) {
        crc ^= data[i] << 8;

        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ poly;
            } else {
                crc <<= 1;
            }
        }

        crc &= 0xffff;
    }

    return crc;
}

const COMMAND_PREFIX = new Uint8Array([0xab, 0xcd]);
const COMMAND_SUFFIX = new Uint8Array([0xdc, 0xba]);

enum RadioMode {
    DFU,
    DATA
}

interface RadioInfo {
    mode: RadioMode;
    firmwareVersion: string;
}

export class QuanshengUVK5 extends SerialRadio {
    definition = QuanshengUVK5Definition;

    async sendCommand(data: Uint8Array): Promise<void> {
        log(`sendCommand: command with length ${data.length}`, data);

        const calculatedCrc = crc16xmodem(data);
        const dataWithCrc = new Uint8Array(data.length + 2);
        dataWithCrc.set(data, 0);
        dataWithCrc.set([calculatedCrc & 0xff, (calculatedCrc >> 8) & 0xff], data.length);

        const command = new Uint8Array(2 + dataWithCrc.length + 2);
        command.set(COMMAND_PREFIX, 0);
        command.set([data.length & 0xff, (data.length >> 8) & 0xff], 2)
        command.set(xor(dataWithCrc), 4);
        command.set(COMMAND_SUFFIX, 4 + dataWithCrc.length);

        log(`sendCommand: encoded command with length ${command.length}`, command);
        return await this.connection.write(command);
    }

    async receiveReply(): Promise<Uint8Array> {
        // Header is: AB, CD, length[0], length[1]
        const header = await this.connection.read(4, 1000)
        if (header.length != 4 || header.at(0) != 0xAB || header.at(1) != 0xCD) throw new Error(`Prefix is not 0xABCD, got 0x${header.at(0)?.toString(16)}${header.at(1)?.toString(16)}`)
        
        const length = (header.at(3) << 8) + header.at(2);
        const data = await this.connection.read(length, 1000);

        // Footer is: CRC, CRC, DC, BA
        const footer = await this.connection.read(4, 1000);
        if (footer.length != 4 || footer.at(2) != 0xDC || footer.at(3) != 0xBA) throw new Error(`Footer is not 0xDCBA, got 0x${footer.at(2)?.toString(16)}${footer.at(3)?.toString(16)}`)

        log(`receiveReply: encoded reply with length ${data.length}`, data);

        const decodedData = xor(data);

        log(`receiveReply: reply with length ${decodedData.length}`, decodedData);

        return decodedData;
    }

    async sayHello(): Promise<RadioInfo> {
        throw new Error("Method not implemented.");
    }

    downloadCodeplug(emitter?: TransferEmitter | undefined): void {
        throw new Error("Method not implemented.");
    }
    uploadCodeplug(emitter?: TransferEmitter | undefined): void {
        throw new Error("Method not implemented.");
    }
}

export const QuanshengUVK5Definition: RadioDefinition = {
    identifiers: [
        ['Quansheng', 'UV-K5', 1]
    ],
    transport: Transport.SERIAL,
    image,
    factory: QuanshengUVK5,
    serialOptions: {
        baudRate: 38400,
        dataBits: 8,
        parity: 'none',
        flowControl: 'none',
        stopBits: 1
    }
}