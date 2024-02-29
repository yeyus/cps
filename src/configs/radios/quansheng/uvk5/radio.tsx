import retry from "async-retry";
import { Transport } from "../../../../modules/connection-manager/types";
import { TransferEmitter } from "../../../../utils/transfer-emitter";
import { RadioDefinition } from "../../../radio-config";

import image from "./photo.png";
import { SerialRadio } from "../../../../modules/radio-types/transports/serial/serial";
import getLogger from "../../../../utils/logger";
import SerialConnection from "../../../../modules/radio-types/transports/serial/serial-connection";
import { CodeplugReadResponse } from "../../../../modules/radio-types/base";

const logger = getLogger("QuanshengUVK5");

const XOR_KEY = new Uint8Array([
  0x16, 0x6c, 0x14, 0xe6, 0x2e, 0x91, 0x0d, 0x40, 0x21, 0x35, 0xd5, 0x40, 0x13, 0x03, 0xe9, 0x80,
]);

export const xor = (data: Uint8Array) => {
  const dataCopy = new Uint8Array(data);
  dataCopy.forEach((_, index, array) => {
    // eslint-disable-next-line no-param-reassign
    array[index] ^= XOR_KEY[index % XOR_KEY.length];
  });
  return dataCopy;
};

function crc16xmodem(data: Uint8Array, initialCrc = 0): number {
  const poly = 0x1021;

  let crc = initialCrc;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i] << 8;

    for (let j = 0; j < 8; j += 1) {
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

const EEPROM_SIZE = 0x2000;
const EEPROM_BLOCK_SIZE = 0x80;

const COMMAND_PREFIX = new Uint8Array([0xab, 0xcd]);
const COMMAND_SUFFIX = new Uint8Array([0xdc, 0xba]);

/* COMMAND: HELLO
  14 05 04 00 6a 39 57 64
*/
const COMMAND_HELLO = new Uint8Array([0x14, 0x05, 0x04, 0x00, 0x6a, 0x39, 0x57, 0x64]);

/* COMMAND: READ MEM
  1b 05 08 00 [o1 o2] [le] 00 6a 39 57 64
*/
const COMMAND_READMEM = (offset: number, length: number = 0x80) => {
  const buffer = new ArrayBuffer(12);
  const cmd = new Uint8Array(buffer);
  const view = new DataView(buffer);
  cmd.set([0x1b, 0x05, 0x08, 0x00], 0);
  view.setUint16(4, offset, true);
  view.setUint8(6, length);
  cmd.set([0x00, 0x6a, 0x39, 0x57, 0x64], 7);

  return cmd;
};

/* COMMAND: RESET
  dd 05 00 00
*/
const COMMAND_RESET = new Uint8Array([0xdd, 0x05, 0x00, 0x00]);

enum RadioMode {
  DFU,
  DATA,
}

interface RadioInfo {
  mode: RadioMode;
  firmwareVersion: string;
}

export class QuanshengUVK5 extends SerialRadio {
  // eslint-disable-next-line no-use-before-define
  definition = QuanshengUVK5Definition;

  async sendCommand(data: Uint8Array): Promise<void> {
    logger.info(`sendCommand: command with length ${data.length}`);
    logger.hex(data);

    const calculatedCrc = crc16xmodem(data);
    const dataWithCrc = new Uint8Array(data.length + 2);
    dataWithCrc.set(data, 0);
    dataWithCrc.set([calculatedCrc & 0xff, (calculatedCrc >> 8) & 0xff], data.length);

    const command = new Uint8Array(2 + 2 + dataWithCrc.length + 2);
    command.set(COMMAND_PREFIX, 0);
    command.set([data.length & 0xff, (data.length >> 8) & 0xff], 2);
    command.set(xor(dataWithCrc), 4);
    command.set(COMMAND_SUFFIX, 4 + dataWithCrc.length);

    logger.info(`sendCommand: encoded command with length ${command.length}`);
    logger.hex(command);

    return this.connection.write(command);
  }

  async receiveReply(): Promise<Uint8Array> {
    // Header is: AB, CD, length[0], length[1]
    logger.debug("receiveReply: read 4 header bytes");
    const header = await this.connection.read(4, 1000);
    if (header.length !== 4 || header.at(0) !== 0xab || header.at(1) !== 0xcd)
      throw new Error(`Prefix is not 0xABCD, got 0x${header.at(0)?.toString(16)}${header.at(1)?.toString(16)}`);

    const length = ((header.at(3) || 0) << 8) + (header.at(2) || 0);
    logger.debug(`receiveReply: read package of length ${length} bytes`);
    const data = await this.connection.read(length, 1000);

    // Footer is: CRC, CRC, DC, BA
    logger.debug(`receiveReply: read 4 footer bytes`);
    const footer = await this.connection.read(4, 1000);
    if (footer.length !== 4 || footer.at(2) !== 0xdc || footer.at(3) !== 0xba)
      throw new Error(`Footer is not 0xDCBA, got 0x${footer.at(2)?.toString(16)}${footer.at(3)?.toString(16)}`);

    logger.info(`receiveReply: encoded reply with length ${data.length}`);
    logger.hex(data);

    const decodedData = xor(data);

    logger.info(`receiveReply: reply with length ${decodedData.length}`);
    logger.hex(decodedData);

    return decodedData;
  }

  async sayHello(): Promise<RadioInfo> {
    logger.info(`%csayHello: sending hello packet`, "color: green");
    await this.sendCommand(COMMAND_HELLO);

    const reply = await this.receiveReply();

    const radioInfo: RadioInfo = {
      mode: RadioMode.DATA,
      firmwareVersion: "",
    };

    if (reply.at(0) === 0x18 && reply.at(1) === 0x05) {
      logger.warn(`sayHello: radio is in firmware flash mode`);
      radioInfo.mode = RadioMode.DFU;
    }

    const asciiDecoder = new TextDecoder();

    // extract radio firmware serial
    radioInfo.firmwareVersion = asciiDecoder.decode(reply.slice(4, 16));
    logger.info(`%csayHello: hello done for radio with firmware ${radioInfo.firmwareVersion}`, "color: green");
    return radioInfo;
  }

  async readMemory(offset: number, length: number): Promise<Uint8Array> {
    logger.info(
      `%creadMemory: sending offset=0x${offset.toString(16)} length=0x${length.toString(16)}`,
      "color: green",
    );
    await this.sendCommand(COMMAND_READMEM(offset, length));

    logger.info(`%creadMemory: awaiting reply`, "color: green");
    const response = await this.receiveReply();
    const out = response.slice(8, response.length);
    logger.info(`%creadMemory: received data with length=${out.length}`, "color: green");
    logger.hex(out);
    return out;
  }

  async resetRadio(): Promise<void> {
    logger.log(`%cresetRadio: sending command`, "color: green");
    await this.sendCommand(COMMAND_RESET);
  }

  async downloadCodeplug(emitter?: TransferEmitter | undefined): Promise<CodeplugReadResponse> {
    const buffer = new Uint8Array(EEPROM_SIZE);
    emitter?.setTotal(EEPROM_SIZE / EEPROM_BLOCK_SIZE);

    const bindedSayHello = this.sayHello.bind(this);
    // @ts-expect-error async-retry doesnt properly import retry module options
    const radioInfo = await retry(bindedSayHello, { retries: 5, maxTimeout: 1500 });

    logger.log(`%cdownloadCodeplug: firmware version: ${radioInfo.firmwareVersion}`, "color: orange");

    for (let address = 0; address < EEPROM_SIZE; address += EEPROM_BLOCK_SIZE) {
      // eslint-disable-next-line no-await-in-loop
      const chunk = await this.readMemory(address, EEPROM_BLOCK_SIZE);
      buffer.set(chunk, address);
      emitter?.update((v) => v + 1);
    }

    emitter?.done();
    return new CodeplugReadResponse(buffer, { firmwareVersion: radioInfo.firmwareVersion });
  }

  uploadCodeplug(): void {
    throw new Error("Method not implemented.");
  }
}

export const QuanshengUVK5Definition: RadioDefinition<QuanshengUVK5> = {
  identifiers: [["Quansheng", "UV-K5", 1]],
  transport: Transport.SERIAL,
  image,
  createRadio(connection: SerialConnection) {
    return new QuanshengUVK5(connection);
  },
  serialOptions: {
    baudRate: 38400,
    dataBits: 8,
    parity: "none",
    flowControl: "none",
    stopBits: 1,
  },
};
