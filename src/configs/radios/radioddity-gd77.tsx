import { Transport } from "../../modules/connection-manager/types";
import { RadioDefinition } from "../radio-config";

export const RaddiodityGD77Definition : RadioDefinition = {
    identifiers: [
        ['Raddiodity', 'GD-77', 1]
    ],
    transport: Transport.USB_HID,
    image: 'https://cdn.shopify.com/s/files/1/0011/7220/9721/files/pic_009_4174c0e4-505c-42c8-82b8-acc042859fb3_300x.jpg?v=1600680218',
    factory: null
}