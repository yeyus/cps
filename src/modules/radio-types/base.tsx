/* eslint-disable max-classes-per-file */
import { TransferEmitter } from "@utils/transfer-emitter";

export enum Transport {
  USB_CUSTOM = "usb-custom",
  USB_HID = "usb-hid",
  SERIAL = "serial",
}

interface CodeplugReadExtras {
  firmwareVersion?: string;
}

export class CodeplugReadResponse {
  modifiedAt: Date;

  memory: Uint8Array;

  extras: CodeplugReadExtras;

  constructor(memory: Uint8Array, modifiedAt?: Date, extras?: CodeplugReadExtras) {
    this.modifiedAt = modifiedAt ?? new Date();
    this.memory = memory;
    this.extras = extras ?? {};
  }
}

export interface BaseRadioInterface {
  transport: Transport;

  downloadCodeplug(emitter?: TransferEmitter): Promise<CodeplugReadResponse>;

  uploadCodeplug(emitter?: TransferEmitter): void;
}
