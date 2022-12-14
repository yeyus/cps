import { Transport } from "../../modules/connection-manager/types";
import { TransferEmitter } from "../../utils/transfer-emitter";
import { RadioDefinition, SerialRadio } from "../radio-config";

const log = (...args: any[]) => console.log('[RaddiodityGD88]', ...args);

const encoder = new TextEncoder();

const FLASH_READ = encoder.encode('Flash Read ');
const FLASH_READ_TRAILER = [0, 0x3C, 0, 0, 0, 
    0, 0, 0x37, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0
];

const COMMAND_READ_FLASH = new Uint8Array(FLASH_READ.length + FLASH_READ_TRAILER.length);
COMMAND_READ_FLASH.set(FLASH_READ, 0);
COMMAND_READ_FLASH.set(FLASH_READ_TRAILER, FLASH_READ.length);


const COMMAND_READ = encoder.encode('Read');

export class RaddiodityGD88 extends SerialRadio {
    definition = RaddiodityGD88Definition;
    
    async getRadioInformation(): Promise<Uint8Array> {
        log(`getRadioInformation`);
        await this.connection.write(Uint8Array.from(COMMAND_READ_FLASH));

        await this.connection.read(2, 1000);
         
        return await this.connection.read(105, 1000);
    }

    async readFlashChunk(): Promise<Uint8Array> {
        log(`readFlashChunk`);
        await this.connection.write(Uint8Array.from(COMMAND_READ));
        return this.connection.read(2048, 1000);            
    }

    async downloadCodeplug(emitter?: TransferEmitter): Promise<Uint8Array> {
        const buffer = new Uint8Array(128 * 1024);
        emitter && emitter.setTotal(58);

        await this.getRadioInformation();
        emitter && emitter.update(v => v+1);
        let offset = 0;
        for (let i = 0; i < 56; i++) {
            log(`Initiating read for chunk ${i} of 56`);
            const chunk = await this.readFlashChunk();
            log(`chunk ${i} of 56 read`);
            buffer.set(chunk, offset);
            offset += chunk.length;
            emitter && emitter.update(v => v+1);
        }

        emitter && emitter.done();
        return buffer;
    }

    uploadCodeplug(emitter?: TransferEmitter): void {
        throw new Error("Method not implemented.");
    }   
}

export const RaddiodityGD88Definition : RadioDefinition = {
    identifiers: [
        ['Raddiodity', 'GD-88', 1],
        ['DR-880UV', 'Kydera', 1]
    ],
    transport: Transport.SERIAL,
    image: 'https://cdn.shopify.com/s/files/1/0011/7220/9721/files/GD-88_8a374432-3d75-49a3-8261-6fa5548492c1_300x.png?v=1659321887',
    factory: RaddiodityGD88,
    // Shake: 1, Replace: 40
    //  -> SERIAL_DTR_CONTROL
    //           -> SERIAL_RTS_CONTROL
    // https://docs.microsoft.com/en-us/windows-hardware/drivers/ddi/ntddser/ns-ntddser-_serial_handflow
    // https://github.com/tpn/winsdk-10/blob/master/Include/10.0.14393.0/shared/ntddser.h#L362
    serialOptions: {
        baudRate: 115200,
        dataBits: 8,
        parity: 'none',
        flowControl: 'none',
        stopBits: 1
    }
}
