/* eslint-disable max-classes-per-file */
import BitView from "../bitview";

/*
    #seekto 0xd60;
    struct {
    u8 is_scanlist1:1,
    is_scanlist2:1,
    compander:2,
    is_free:1,
    band:3;
    } channel_attributes[200];
*/
export class MemoryMapChannelAttributes {
  public static BASE: number = 0xd60;

  public static LENGTH: number = 1;

  public isScanlist1: boolean;

  public isScanlist2: boolean;

  public compander: number;

  public isFree: boolean;

  public band: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapChannelAttributes {
    const memoryMapChannelAttributes = new MemoryMapChannelAttributes();
    memoryMapChannelAttributes.isScanlist1 = BitView.asBoolean(buffer, offset, 7);
    memoryMapChannelAttributes.isScanlist2 = BitView.asBoolean(buffer, offset, 6);
    memoryMapChannelAttributes.compander = BitView.asNumber(buffer, offset, 4, 2);
    memoryMapChannelAttributes.isFree = BitView.asBoolean(buffer, offset, 3);
    memoryMapChannelAttributes.band = BitView.asNumber(buffer, offset, 0, 3);

    return memoryMapChannelAttributes;
  }
}

/*
#seekto 0xed0;
struct {
u8 side_tone;
char separate_code;
char group_call_code;
u8 decode_response;
u8 auto_reset_time;
u8 preload_time;
u8 first_code_persist_time;
u8 hash_persist_time;
u8 code_persist_time;
u8 code_interval_time;
u8 permit_remote_kill;
} dtmf_settings;
*/
export class MemoryMapDtmfSettings {
  public static BASE: number = 0xd60;

  public static LENGTH: number = 11;

  public sideTone: number;

  public separateCode: string;

  public groupCallCode: string;

  // ...

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapDtmfSettings {
    const memoryMapDtmfSettings = new MemoryMapDtmfSettings();
    memoryMapDtmfSettings.sideTone = buffer.at(MemoryMapDtmfSettings.BASE);
    memoryMapDtmfSettings.separateCode = String.fromCharCode(buffer.at(MemoryMapDtmfSettings.BASE + 1));
    memoryMapDtmfSettings.groupCallCode = String.fromCharCode(buffer.at(MemoryMapDtmfSettings.BASE + 2));
    // ...

    return memoryMapDtmfSettings;
  }
}

export class QuanshengUV5KMemoryMap {
  public channelAttributes: MemoryMapChannelAttributes[];

  public dtmfSettings: MemoryMapDtmfSettings;

  public static fromBuffer(buffer: Uint8Array): QuanshengUV5KMemoryMap {
    const memoryMap = new QuanshengUV5KMemoryMap();

    for (let i = 0; i < 200; i += 1) {
      memoryMap.channelAttributes.push(
        MemoryMapChannelAttributes.fromBuffer(
          buffer,
          MemoryMapChannelAttributes.BASE + i * MemoryMapChannelAttributes.LENGTH,
        ),
      );
    }

    memoryMap.dtmfSettings = MemoryMapDtmfSettings.fromBuffer(buffer, MemoryMapDtmfSettings.BASE);

    return memoryMap;
  }
}
