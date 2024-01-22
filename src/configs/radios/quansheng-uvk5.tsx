import { Transport } from "../../modules/connection-manager/types";
import { TransferEmitter } from "../../utils/transfer-emitter";
import { RadioDefinition, SerialRadio } from "../radio-config";

import image from "./images/quanshenk-uvk5-photo.png";

const log = (...args: any[]) => console.log("[QuanshengUVK5]", ...args);

const XOR_KEY = new Uint8Array([
  0x16, 0x6c, 0x14, 0xe6, 0x2e, 0x91, 0x0d, 0x40, 0x21, 0x35, 0xd5, 0x40, 0x13, 0x03, 0xe9, 0x80,
]);

export const xor = (data: Uint8Array) => {
  const dataCopy = new Uint8Array(data);
  dataCopy.forEach((_, index, array) => (array[index] ^= XOR_KEY[index % XOR_KEY.length]));
  return dataCopy;
};

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

/* COMMAND: HELLO
  14 05 04 00 6a 39 57 64
*/
const COMMAND_HELLO = new Uint8Array([0x14, 0x05, 0x04, 0x00, 0x6a, 0x39, 0x57, 0x64]);

/* COMMAND: READ MEM
  1b 05 08 00 [o1 o2] [le] 00 6a 39 57 64
*/
const COMMAND_READMEM = (offset: number, length: number) => {
  const cmd = new Uint8Array(12);
  cmd.set([0x1b, 0x05, 0x08, 0x00], 0);
  cmd.set([offset & 0xff, (offset >> 8) & 0xff], 4);
  cmd.set([length & 0xff], 5);
  cmd.set([0x00, 0x6a, 0x39, 0x57, 0x64], 6);

  return cmd;
};

enum RadioMode {
  DFU,
  DATA,
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
    command.set([data.length & 0xff, (data.length >> 8) & 0xff], 2);
    command.set(xor(dataWithCrc), 4);
    command.set(COMMAND_SUFFIX, 4 + dataWithCrc.length);

    log(`sendCommand: encoded command with length ${command.length}`, command);
    return await this.connection.write(command);
  }

  async receiveReply(): Promise<Uint8Array> {
    // Header is: AB, CD, length[0], length[1]
    const header = await this.connection.read(4, 1000);
    if (header.length !== 4 || header.at(0) !== 0xab || header.at(1) !== 0xcd)
      throw new Error(`Prefix is not 0xABCD, got 0x${header.at(0)?.toString(16)}${header.at(1)?.toString(16)}`);

    const length = ((header.at(3) || 0) << 8) + (header.at(2) || 0);
    const data = await this.connection.read(length, 1000);

    // Footer is: CRC, CRC, DC, BA
    const footer = await this.connection.read(4, 1000);
    if (footer.length !== 4 || footer.at(2) !== 0xdc || footer.at(3) !== 0xba)
      throw new Error(`Footer is not 0xDCBA, got 0x${footer.at(2)?.toString(16)}${footer.at(3)?.toString(16)}`);

    log(`receiveReply: encoded reply with length ${data.length}`, data);

    const decodedData = xor(data);

    log(`receiveReply: reply with length ${decodedData.length}`, decodedData);

    return decodedData;
  }

  async sayHello(): Promise<RadioInfo> {
    log(`sayHello: sending hello packet`);
    await this.sendCommand(COMMAND_HELLO);

    const reply = await this.receiveReply();

    let radioInfo: RadioInfo = {
      mode: RadioMode.DATA,
      firmwareVersion: "",
    };

    if (reply.at(0) === 0x18 && reply.at(1) === 0x05) {
      log(`sayHello: radio is in firmware flash mode`);
      radioInfo.mode = RadioMode.DFU;
    }

    const asciiDecoder = new TextDecoder();

    // extract radio firmware serial
    radioInfo.firmwareVersion = asciiDecoder.decode(reply.slice(4, 14));
    return radioInfo;
  }

  async readMemory(offset: number, length: number): Promise<Uint8Array> {
    log(`readMemory: sending offset=0x${offset.toString(16)} length=0x${length.toString(16)}`);
    await this.sendCommand(COMMAND_READMEM(offset, length));

    log(`readMemory: awaiting reply`);
    const response = await this.receiveReply();
    const out = response.slice(8, response.length);
    log(`readMemory: received data`, out);
    return out;
  }

  downloadCodeplug(emitter?: TransferEmitter | undefined): void {
    throw new Error("Method not implemented.");
  }
  uploadCodeplug(emitter?: TransferEmitter | undefined): void {
    throw new Error("Method not implemented.");
  }
}

export const QuanshengUVK5Definition: RadioDefinition = {
  identifiers: [["Quansheng", "UV-K5", 1]],
  transport: Transport.SERIAL,
  image,
  factory: QuanshengUVK5,
  serialOptions: {
    baudRate: 38400,
    dataBits: 8,
    parity: "none",
    flowControl: "none",
    stopBits: 1,
  },
};
