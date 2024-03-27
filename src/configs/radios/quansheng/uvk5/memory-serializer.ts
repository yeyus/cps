import { Timestamp } from "@bufbuild/protobuf";
import { CodeplugReadResponse } from "@modules/radio-types/base";
import { Channel, ChannelSlot, ChannelSlotType, Mode, Power, ToneSquelch } from "@/proto/gen/cps/model/v1/channel_pb";
import { Codeplug, RadioIdentification, RadioType } from "@/proto/gen/cps/model/v1/codeplug_pb";
import { UVK5ChannelCustomParams } from "@/proto/gen/cps/model/v1/custom/uvk5/uvk5_pb";
import { MemorySerializer } from "../../../memory-serializer";
import { MemoryMapChannel, MemoryMapChannelAttributes, QuanshengUVK5MemoryMap } from "./memory-map";

const STEP_LOOKUP_TABLE = [
  BigInt(1000),
  BigInt(2500),
  BigInt(5000),
  BigInt(6250),
  BigInt(10000),
  BigInt(12500),
  BigInt(25000),
  BigInt(8330),
];

const CTCSS_LOOKUP_TABLE = [
  670, 693, 719, 744, 770, 797, 825, 854, 885, 915, 948, 974, 1000, 1035, 1072, 1109, 1148, 1188, 1230, 1273, 1318,
  1365, 1413, 1462, 1514, 1567, 1598, 1622, 1655, 1679, 1713, 1738, 1773, 1799, 1835, 1862, 1899, 1928, 1966, 1995,
  2035, 2065, 2107, 2181, 2257, 2291, 2336, 2418, 2503, 2541,
];

const DCS_LOOKUP_TABLE = [
  23, 25, 26, 31, 32, 36, 43, 47, 51, 53, 54, 65, 71, 72, 73, 74, 114, 115, 116, 122, 125, 131, 132, 134, 143, 145, 152,
  155, 156, 162, 165, 172, 174, 205, 212, 223, 225, 226, 243, 244, 245, 246, 251, 252, 255, 261, 263, 265, 266, 271,
  274, 306, 311, 315, 325, 331, 332, 343, 346, 351, 356, 364, 365, 371, 411, 412, 413, 423, 431, 432, 445, 446, 452,
  454, 455, 462, 464, 465, 466, 503, 506, 516, 523, 526, 532, 546, 565, 606, 612, 624, 627, 631, 632, 654, 662, 664,
  703, 712, 723, 731, 732, 734, 743, 754,
];

const POWER_LOOKUP_TABLE = [
  new Power({ label: "Low", milliwatts: 1500 }),
  new Power({ label: "Medium", milliwatts: 3000 }),
  new Power({ label: "High", milliwatts: 5000 }),
];

const BANDS_LOOKUP_TABLE = [
  "BAND 1 50Mhz-76Mhz VFO A",
  "BAND 1 50Mhz-76Mhz VFO B",
  "BAND 2 108Mhz-136Mhz VFO A",
  "BAND 2 108Mhz-136Mhz VFO B",
  "BAND 3 136Mhz-174Mhz VFO A",
  "BAND 3 136Mhz-174Mhz VFO B",
  "BAND 4 174Mhz-350Mhz VFO A",
  "BAND 4 174Mhz-350Mhz VFO B",
  "BAND 5 350Mhz-400Mhz VFO A",
  "BAND 5 350Mhz-400Mhz VFO B",
  "BAND 6 400Mhz-470Mhz VFO A",
  "BAND 6 400Mhz-470Mhz VFO B",
  "BAND 7 470Mhz-600Mhz VFO B",
  "BAND 7 470Mhz-600Mhz VFO B",
];

function parseName(chars: string[]): string {
  let parsed = "";
  for (let i = 0; i < chars.length; i += 1) {
    if (chars[i].charCodeAt(0) < 0x20 || chars[i].charCodeAt(0) > 0x7f) return parsed;
    parsed += chars[i];
  }

  return parsed;
}

export default class QuanshengUVK5MemorySerializer implements MemorySerializer {
  deserialize(codeplugRead: CodeplugReadResponse): Codeplug {
    const memoryMap = QuanshengUVK5MemoryMap.fromBuffer(codeplugRead.memory);
    const codeplug = new Codeplug();

    codeplug.radio = new RadioIdentification({
      definition: RadioType.QUANSHENG_UVK5_V0,
      brand: "Quansheng",
      model: "UV-K5",
      revision: "rev1",
      firmwareVersion: codeplugRead.extras.firmwareVersion,
    });

    codeplug.channelSlots = this.deserializeChannelSlots(memoryMap);

    return codeplug;
  }

  deserializeChannelSlots(memoryMap: QuanshengUVK5MemoryMap): ChannelSlot[] {
    const channelSlots = [];

    // memory channels
    for (let i = 0; i < 200; i += 1) {
      const channel = memoryMap.channel[i];
      const channelAttributes = memoryMap.channelAttributes[i];

      // determine if channel is empty
      if (memoryMap.channelAttributes[i].isFree) {
        channelSlots.push(new ChannelSlot({ type: ChannelSlotType.MEMORY, isEmpty: true }));
      } else {
        const channelSlot = new ChannelSlot({ type: ChannelSlotType.MEMORY, isEmpty: false });
        channelSlot.channel = this.deserializeChannel(
          parseName(memoryMap.channelname[i].name),
          channel,
          channelAttributes,
        );
        channelSlots.push(channelSlot);
      }
    }

    // vfo channels - vfoA and vfoB per each of the 7 bands
    for (let i = 0; i < BANDS_LOOKUP_TABLE.length; i += 1) {
      const channel = memoryMap.channel[i + 200];
      const bandName = BANDS_LOOKUP_TABLE[i];
      const channelSlot = new ChannelSlot({ type: ChannelSlotType.VFO, isEmpty: false });

      channelSlot.channel = this.deserializeChannel(bandName, channel, undefined);

      channelSlots.push(channelSlot);
    }
    return channelSlots;
  }

  private deserializeChannel(
    name: string,
    channel: MemoryMapChannel,
    channelAttributes?: MemoryMapChannelAttributes,
  ): Channel {
    const customChannelParams = new UVK5ChannelCustomParams({
      isScanlist1: channelAttributes?.isScanlist1,
      isScanlist2: channelAttributes?.isScanlist2,
      bclo: channel.bclo,
      frequencyReverse: channel.freqReverse,
      scrambler: channel.scrambler,
      isDtmf: channel.dtmfDecode,
      dtmfPttId: channel.dtmfPttid,
    });

    return new Channel({
      name,
      frequency: BigInt(channel.freq * 10),
      offset: BigInt(channel.offset * 10),
      step: STEP_LOOKUP_TABLE[channel.step],
      bandwidth: channel.bandwidth ? 12500 : 25000,
      rxTone: this.deserializeToneSquelch(channel.rxcodeflag, channel.rxcode),
      txTone: this.deserializeToneSquelch(channel.txcodeflag, channel.txcode),
      // eslint-disable-next-line no-nested-ternary
      mode: channel.enableAm ? Mode.AM : channel.bandwidth ? Mode.NFM : Mode.WFM,
      power: POWER_LOOKUP_TABLE[channel.txpower],
      createdAt: Timestamp.now(),
      uvk5CustomChannelParams: customChannelParams,
    });
  }

  private deserializeToneSquelch(codeflag: number, code: number): ToneSquelch | undefined {
    if (codeflag === 0) {
      return undefined;
    }
    if (codeflag === 1) {
      // CTCSS [code 0 to 0x31 ]
      return new ToneSquelch({ ctcss: CTCSS_LOOKUP_TABLE[code] });
    }
    if (codeflag === 2) {
      // DCS [ code 0 to 0x67 ]
      return new ToneSquelch({ dcs: DCS_LOOKUP_TABLE[code] });
    }
    if (codeflag === 3) {
      // Reverse DCS
      return new ToneSquelch({ dcs: DCS_LOOKUP_TABLE[code], dcsReversePolarity: true });
    }

    throw new Error(`Unknown tone squelch => codeflag=${codeflag} code=${code}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serialize(codseplug: Codeplug): Uint8Array {
    throw new Error("Method not implemented.");
  }
}
