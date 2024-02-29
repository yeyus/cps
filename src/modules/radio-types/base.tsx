/* eslint-disable max-classes-per-file */
import { Codeplug } from "../../proto/gen/cps/model/v1/codeplug_pb";
import { TransferEmitter } from "../../utils/transfer-emitter";

export enum Transport {
  USB_CUSTOM = "usb-custom",
  USB_HID = "usb-hid",
  SERIAL = "serial",
}

interface CodeplugReadExtras {
  firmwareVersion?: string;
}

export class CodeplugReadResponse {
  downloadedAt: Date;

  memory: Uint8Array;

  extras: CodeplugReadExtras;

  constructor(memory: Uint8Array, extras?: CodeplugReadExtras) {
    this.downloadedAt = new Date();
    this.memory = memory;
    this.extras = extras ?? {};
  }
}

export interface BaseRadioInterface {
  transport: Transport;

  downloadCodeplug(emitter?: TransferEmitter): Promise<CodeplugReadResponse>;
  deserializeCodeplug(readResponse: CodeplugReadResponse): Codeplug;

  uploadCodeplug(emitter?: TransferEmitter): void;
}
