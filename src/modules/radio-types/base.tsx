import { TransferEmitter } from "../../utils/transfer-emitter";

export enum Transport {
  USB_CUSTOM = "usb-custom",
  USB_HID = "usb-hid",
  SERIAL = "serial",
}

export interface BaseRadioInterface {
  transport: Transport;

  downloadCodeplug(emitter?: TransferEmitter): Promise<Uint8Array>;
  uploadCodeplug(emitter?: TransferEmitter): void;
}
