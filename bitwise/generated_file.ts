/* eslint-disable max-classes-per-file */
import BitView from "../bitview";

export class MemoryMapChannel {
  public static BASE: number = 0;

  public static LENGTH: number = 3424;

  public freq: number;

  public offset: number;

  public rxcode: number;

  public txcode: number;

  public txcodeflag: number;

  public rxcodeflag: number;

  public flags1Unknown7: boolean;

  public flags1Unknown6: boolean;

  public flags1Unknown5: boolean;

  public enableAm: boolean;

  public flags1Unknown3: boolean;

  public isInScanlist: boolean;

  public shift: number;

  public flags2Unknown7: boolean;

  public flags2Unknown6: boolean;

  public flags2Unknown5: boolean;

  public bclo: boolean;

  public txpower: number;

  public bandwidth: boolean;

  public freqReverse: boolean;

  public dtmfFlagsUnknown7: boolean;

  public dtmfFlagsUnknown6: boolean;

  public dtmfFlagsUnknown5: boolean;

  public dtmfFlagsUnknown4: boolean;

  public dtmfFlagsUnknown3: boolean;

  public dtmfPttid: number;

  public dtmfDecode: boolean;

  public step: number;

  public scrambler: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapChannel {
    const dataView = new DataView(buffer.buffer);
    const channel = new MemoryMapChannel();
    let currentOffset = offset ?? MemoryMapChannel.BASE;
    channel.freq = dataView.getUint32(currentOffset, true);
    currentOffset += 4;
    channel.offset = dataView.getUint32(currentOffset, true);
    currentOffset += 4;
    channel.rxcode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    channel.txcode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    channel.txcodeflag = BitView.asNumber(buffer, currentOffset, 4, 4);
    channel.rxcodeflag = BitView.asNumber(buffer, currentOffset, 0, 4);
    currentOffset += 1;
    channel.flags1Unknown7 = BitView.asBoolean(buffer, currentOffset, 7);
    channel.flags1Unknown6 = BitView.asBoolean(buffer, currentOffset, 6);
    channel.flags1Unknown5 = BitView.asBoolean(buffer, currentOffset, 5);
    channel.enableAm = BitView.asBoolean(buffer, currentOffset, 4);
    channel.flags1Unknown3 = BitView.asBoolean(buffer, currentOffset, 3);
    channel.isInScanlist = BitView.asBoolean(buffer, currentOffset, 2);
    channel.shift = BitView.asNumber(buffer, currentOffset, 0, 2);
    currentOffset += 1;
    channel.flags2Unknown7 = BitView.asBoolean(buffer, currentOffset, 7);
    channel.flags2Unknown6 = BitView.asBoolean(buffer, currentOffset, 6);
    channel.flags2Unknown5 = BitView.asBoolean(buffer, currentOffset, 5);
    channel.bclo = BitView.asBoolean(buffer, currentOffset, 4);
    channel.txpower = BitView.asNumber(buffer, currentOffset, 2, 2);
    channel.bandwidth = BitView.asBoolean(buffer, currentOffset, 1);
    channel.freqReverse = BitView.asBoolean(buffer, currentOffset, 0);
    currentOffset += 1;
    channel.dtmfFlagsUnknown7 = BitView.asBoolean(buffer, currentOffset, 7);
    channel.dtmfFlagsUnknown6 = BitView.asBoolean(buffer, currentOffset, 6);
    channel.dtmfFlagsUnknown5 = BitView.asBoolean(buffer, currentOffset, 5);
    channel.dtmfFlagsUnknown4 = BitView.asBoolean(buffer, currentOffset, 4);
    channel.dtmfFlagsUnknown3 = BitView.asBoolean(buffer, currentOffset, 3);
    channel.dtmfPttid = BitView.asNumber(buffer, currentOffset, 1, 2);
    channel.dtmfDecode = BitView.asBoolean(buffer, currentOffset, 0);
    currentOffset += 1;
    channel.step = dataView.getUint8(currentOffset);
    currentOffset += 1;
    channel.scrambler = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return channel;
  }
}
export class MemoryMapChannelAttributes {
  public static BASE: number = 3424;

  public static LENGTH: number = 200;

  public isScanlist1: boolean;

  public isScanlist2: boolean;

  public compander: number;

  public isFree: boolean;

  public band: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapChannelAttributes {
    const dataView = new DataView(buffer.buffer);
    const channelAttributes = new MemoryMapChannelAttributes();
    let currentOffset = offset ?? MemoryMapChannelAttributes.BASE;
    channelAttributes.isScanlist1 = BitView.asBoolean(buffer, currentOffset, 7);
    channelAttributes.isScanlist2 = BitView.asBoolean(buffer, currentOffset, 6);
    channelAttributes.compander = BitView.asNumber(buffer, currentOffset, 4, 2);
    channelAttributes.isFree = BitView.asBoolean(buffer, currentOffset, 3);
    channelAttributes.band = BitView.asNumber(buffer, currentOffset, 0, 3);
    currentOffset += 1;
    return channelAttributes;
  }
}
export class MemoryMapDtmfSettings {
  public static BASE: number = 3792;

  public static LENGTH: number = 11;

  public sideTone: number;

  public separateCode: string;

  public groupCallCode: string;

  public decodeResponse: number;

  public autoResetTime: number;

  public preloadTime: number;

  public firstCodePersistTime: number;

  public hashPersistTime: number;

  public codePersistTime: number;

  public codeIntervalTime: number;

  public permitRemoteKill: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapDtmfSettings {
    const dataView = new DataView(buffer.buffer);
    const dtmfSettings = new MemoryMapDtmfSettings();
    let currentOffset = offset ?? MemoryMapDtmfSettings.BASE;
    dtmfSettings.sideTone = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.separateCode = String.fromCharCode(buffer.at(currentOffset));
    currentOffset += 1;
    dtmfSettings.groupCallCode = String.fromCharCode(buffer.at(currentOffset));
    currentOffset += 1;
    dtmfSettings.decodeResponse = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.autoResetTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.preloadTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.firstCodePersistTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.hashPersistTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.codePersistTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.codeIntervalTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    dtmfSettings.permitRemoteKill = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return dtmfSettings;
  }
}
export class MemoryMapDtmfSettingsNumbers {
  public static BASE: number = 3808;

  public static LENGTH: number = 56;

  public dtmfLocalCode: string[];

  public unused1: string[];

  public killCode: string[];

  public unused2: string[];

  public reviveCode: string[];

  public unused3: string[];

  public dtmfUpCode: string[];

  public dtmfDownCode: string[];

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapDtmfSettingsNumbers {
    const dataView = new DataView(buffer.buffer);
    const dtmfSettingsNumbers = new MemoryMapDtmfSettingsNumbers();
    let currentOffset = offset ?? MemoryMapDtmfSettingsNumbers.BASE;
    for (let i = 0; i < 3; i += 1) {
      dtmfSettingsNumbers.dtmfLocalCode.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 3;
    for (let i = 0; i < 5; i += 1) {
      dtmfSettingsNumbers.unused1.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 5;
    for (let i = 0; i < 5; i += 1) {
      dtmfSettingsNumbers.killCode.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 5;
    for (let i = 0; i < 3; i += 1) {
      dtmfSettingsNumbers.unused2.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 3;
    for (let i = 0; i < 5; i += 1) {
      dtmfSettingsNumbers.reviveCode.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 5;
    for (let i = 0; i < 3; i += 1) {
      dtmfSettingsNumbers.unused3.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 3;
    for (let i = 0; i < 16; i += 1) {
      dtmfSettingsNumbers.dtmfUpCode.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 16;
    for (let i = 0; i < 16; i += 1) {
      dtmfSettingsNumbers.dtmfDownCode.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 16;
    return dtmfSettingsNumbers;
  }
}
export class MemoryMapLock {
  public static BASE: number = 3904;

  public static LENGTH: number = 7;

  public flock: number;

  public tx350: number;

  public killed: number;

  public tx200: number;

  public tx500: number;

  public en350: number;

  public enscramble: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapLock {
    const dataView = new DataView(buffer.buffer);
    const lock = new MemoryMapLock();
    let currentOffset = offset ?? MemoryMapLock.BASE;
    lock.flock = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.tx350 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.killed = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.tx200 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.tx500 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.en350 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    lock.enscramble = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return lock;
  }
}
export class MemoryMapChannelname {
  public static BASE: number = 3920;

  public static LENGTH: number = 3200;

  public name: string[];

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapChannelname {
    const dataView = new DataView(buffer.buffer);
    const channelname = new MemoryMapChannelname();
    let currentOffset = offset ?? MemoryMapChannelname.BASE;
    for (let i = 0; i < 16; i += 1) {
      channelname.name.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 16;
    return channelname;
  }
}
export class MemoryMapDtmfcontact {
  public static BASE: number = 7168;

  public static LENGTH: number = 256;

  public name: string[];

  public number: string[];

  public unused_00: string[];

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapDtmfcontact {
    const dataView = new DataView(buffer.buffer);
    const dtmfcontact = new MemoryMapDtmfcontact();
    let currentOffset = offset ?? MemoryMapDtmfcontact.BASE;
    for (let i = 0; i < 8; i += 1) {
      dtmfcontact.name.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 8;
    for (let i = 0; i < 3; i += 1) {
      dtmfcontact.number.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 3;
    for (let i = 0; i < 5; i += 1) {
      dtmfcontact.unused_00.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 5;
    return dtmfcontact;
  }
}
export class MemoryMapLow {
  public static LENGTH: number = 3;

  public start: number;

  public mid: number;

  public end: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapLow {
    const dataView = new DataView(buffer.buffer);
    const low = new MemoryMapLow();
    let currentOffset = offset;
    low.start = dataView.getUint8(currentOffset);
    currentOffset += 1;
    low.mid = dataView.getUint8(currentOffset);
    currentOffset += 1;
    low.end = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return low;
  }
}
export class MemoryMapMedium {
  public static LENGTH: number = 3;

  public start: number;

  public mid: number;

  public end: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapMedium {
    const dataView = new DataView(buffer.buffer);
    const medium = new MemoryMapMedium();
    let currentOffset = offset;
    medium.start = dataView.getUint8(currentOffset);
    currentOffset += 1;
    medium.mid = dataView.getUint8(currentOffset);
    currentOffset += 1;
    medium.end = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return medium;
  }
}
export class MemoryMapHigh {
  public static LENGTH: number = 3;

  public start: number;

  public mid: number;

  public end: number;

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapHigh {
    const dataView = new DataView(buffer.buffer);
    const high = new MemoryMapHigh();
    let currentOffset = offset;
    high.start = dataView.getUint8(currentOffset);
    currentOffset += 1;
    high.mid = dataView.getUint8(currentOffset);
    currentOffset += 1;
    high.end = dataView.getUint8(currentOffset);
    currentOffset += 1;
    return high;
  }
}
export class MemoryMapPerbandpowersettings {
  public static BASE: number = 7888;

  public static LENGTH: number = 112;

  public low: MemoryMapLow;

  public medium: MemoryMapMedium;

  public high: MemoryMapHigh;

  public unused_00: number[];

  public static fromBuffer(buffer: Uint8Array, offset: number): MemoryMapPerbandpowersettings {
    const dataView = new DataView(buffer.buffer);
    const perbandpowersettings = new MemoryMapPerbandpowersettings();
    let currentOffset = offset ?? MemoryMapPerbandpowersettings.BASE;
    perbandpowersettings.low = MemoryMapLow.fromBuffer(buffer, MemoryMapLow.BASE);
    perbandpowersettings.medium = MemoryMapMedium.fromBuffer(buffer, MemoryMapMedium.BASE);
    perbandpowersettings.high = MemoryMapHigh.fromBuffer(buffer, MemoryMapHigh.BASE);
    for (let i = 0; i < 7; i += 1) {
      perbandpowersettings.unused_00.push(dataView.getUint8(currentOffset + i * 1));
    }
    currentOffset += 7;
    return perbandpowersettings;
  }
}
export class QuanshengUVK5MemoryMap {
  public channel: MemoryMapChannel[];

  public channelAttributes: MemoryMapChannelAttributes[];

  public fmfreq: number[];

  public callChannel: number;

  public squelch: number;

  public maxTalkTime: number;

  public noaaAutoscan: number;

  public keyLock: number;

  public voxSwitch: number;

  public voxLevel: number;

  public micGain: number;

  public unknown3: number;

  public channelDisplayMode: number;

  public crossband: number;

  public batterySave: number;

  public dualWatch: number;

  public backlightAutoMode: number;

  public tailNoteElimination: number;

  public vfoOpen: number;

  public beepControl: number;

  public key1ShortpressAction: number;

  public key1LongpressAction: number;

  public key2ShortpressAction: number;

  public key2LongpressAction: number;

  public scanResumeMode: number;

  public autoKeypadLock: number;

  public powerOnDispmode: number;

  public password: number[];

  public keypadTone: number;

  public language: number;

  public alarmMode: number;

  public remindingOfEndTalk: number;

  public repeaterTailElimination: number;

  public logoLine1: string[];

  public logoLine2: string[];

  public dtmfSettings: MemoryMapDtmfSettings;

  public dtmfSettingsNumbers: MemoryMapDtmfSettingsNumbers;

  public scanlistDefault: number;

  public scanlist1PriorityScan: number;

  public scanlist1PriorityCh1: number;

  public scanlist1PriorityCh2: number;

  public scanlist2PriorityScan: number;

  public scanlist2PriorityCh1: number;

  public scanlist2PriorityCh2: number;

  public scanlistUnknown_0xff: number;

  public lock: MemoryMapLock;

  public channelname: MemoryMapChannelname[];

  public dtmfcontact: MemoryMapDtmfcontact[];

  public perbandpowersettings: MemoryMapPerbandpowersettings[];

  public batteryLevel: number[];

  public static fromBuffer(buffer: Uint8Array): QuanshengUVK5MemoryMap {
    const dataView = new DataView(buffer.buffer);
    const memoryMap = new QuanshengUVK5MemoryMap();
    let currentOffset = 0;
    for (let i = 0; i < 214; i += 1) {
      memoryMap.channel.push(MemoryMapChannel.fromBuffer(buffer, MemoryMapChannel.BASE + i * MemoryMapChannel.LENGTH));
    }
    for (let i = 0; i < 200; i += 1) {
      memoryMap.channelAttributes.push(
        MemoryMapChannelAttributes.fromBuffer(
          buffer,
          MemoryMapChannelAttributes.BASE + i * MemoryMapChannelAttributes.LENGTH,
        ),
      );
    }
    currentOffset = 3648;
    for (let i = 0; i < 20; i += 1) {
      memoryMap.fmfreq.push(dataView.getUint16(currentOffset + i * 2, true));
    }
    currentOffset += 40;
    currentOffset = 3696;
    memoryMap.callChannel = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.squelch = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.maxTalkTime = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.noaaAutoscan = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.keyLock = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.voxSwitch = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.voxLevel = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.micGain = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.unknown3 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.channelDisplayMode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.crossband = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.batterySave = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.dualWatch = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.backlightAutoMode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.tailNoteElimination = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.vfoOpen = dataView.getUint8(currentOffset);
    currentOffset += 1;
    currentOffset = 3728;
    memoryMap.beepControl = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.key1ShortpressAction = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.key1LongpressAction = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.key2ShortpressAction = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.key2LongpressAction = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanResumeMode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.autoKeypadLock = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.powerOnDispmode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    for (let i = 0; i < 4; i += 1) {
      memoryMap.password.push(dataView.getUint8(currentOffset + i * 1));
    }
    currentOffset += 4;
    currentOffset = 3744;
    memoryMap.keypadTone = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.language = dataView.getUint8(currentOffset);
    currentOffset += 1;
    currentOffset = 3752;
    memoryMap.alarmMode = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.remindingOfEndTalk = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.repeaterTailElimination = dataView.getUint8(currentOffset);
    currentOffset += 1;
    currentOffset = 3760;
    for (let i = 0; i < 16; i += 1) {
      memoryMap.logoLine1.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 16;
    for (let i = 0; i < 16; i += 1) {
      memoryMap.logoLine2.push(String.fromCharCode(buffer.at(currentOffset + i * 1)));
    }
    currentOffset += 16;
    memoryMap.dtmfSettings = MemoryMapDtmfSettings.fromBuffer(buffer, MemoryMapDtmfSettings.BASE);
    memoryMap.dtmfSettingsNumbers = MemoryMapDtmfSettingsNumbers.fromBuffer(buffer, MemoryMapDtmfSettingsNumbers.BASE);
    currentOffset = 3864;
    memoryMap.scanlistDefault = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist1PriorityScan = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist1PriorityCh1 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist1PriorityCh2 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist2PriorityScan = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist2PriorityCh1 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlist2PriorityCh2 = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.scanlistUnknown_0xff = dataView.getUint8(currentOffset);
    currentOffset += 1;
    memoryMap.lock = MemoryMapLock.fromBuffer(buffer, MemoryMapLock.BASE);
    for (let i = 0; i < 200; i += 1) {
      memoryMap.channelname.push(
        MemoryMapChannelname.fromBuffer(buffer, MemoryMapChannelname.BASE + i * MemoryMapChannelname.LENGTH),
      );
    }
    for (let i = 0; i < 16; i += 1) {
      memoryMap.dtmfcontact.push(
        MemoryMapDtmfcontact.fromBuffer(buffer, MemoryMapDtmfcontact.BASE + i * MemoryMapDtmfcontact.LENGTH),
      );
    }
    for (let i = 0; i < 7; i += 1) {
      memoryMap.perbandpowersettings.push(
        MemoryMapPerbandpowersettings.fromBuffer(
          buffer,
          MemoryMapPerbandpowersettings.BASE + i * MemoryMapPerbandpowersettings.LENGTH,
        ),
      );
    }
    currentOffset = 8000;
    for (let i = 0; i < 6; i += 1) {
      memoryMap.batteryLevel.push(dataView.getUint16(currentOffset + i * 2, true));
    }
    currentOffset += 12;
    return memoryMap;
  }
}
