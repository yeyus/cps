/* eslint-disable max-classes-per-file */

export type TypeToken =
  | "bit"
  | "u8"
  | "u16"
  | "ul16"
  | "u24"
  | "ul24"
  | "u32"
  | "ul32"
  | "i8"
  | "i16"
  | "il16"
  | "i24"
  | "il24"
  | "i32"
  | "il32"
  | "char"
  | "lbcd"
  | "bbcd";

export enum Endianess {
  LITTLE,
  BIG,
}

export class BitwiseType {
  // TODO
  // public static BIT = new BitwiseType(1, false);

  public static U8 = new BitwiseType(1, false);

  public static U16 = new BitwiseType(2, false, Endianess.BIG);

  public static UL16 = new BitwiseType(2, false, Endianess.LITTLE);

  public static U24 = new BitwiseType(3, false, Endianess.BIG);

  public static UL24 = new BitwiseType(3, false, Endianess.LITTLE);

  public static U32 = new BitwiseType(4, false, Endianess.BIG);

  public static UL32 = new BitwiseType(4, false, Endianess.LITTLE);

  public static I8 = new BitwiseType(1, true, Endianess.BIG);

  public static I16 = new BitwiseType(2, true, Endianess.BIG);

  public static IL16 = new BitwiseType(2, true, Endianess.LITTLE);

  public static I24 = new BitwiseType(3, true, Endianess.BIG);

  public static IL24 = new BitwiseType(3, true, Endianess.LITTLE);

  public static I32 = new BitwiseType(4, true, Endianess.BIG);

  public static IL32 = new BitwiseType(4, true, Endianess.LITTLE);

  public static LBCD = new BitwiseType(1, false, Endianess.LITTLE, true);

  public static BBCD = new BitwiseType(1, false, Endianess.BIG, true);

  public static CHAR = new BitwiseType(1, false, undefined, false, true);

  // in bytes
  public length: number;

  public signed: boolean;

  public endianess?: Endianess;

  public isBCDEncoded: boolean;

  public isASCIIEncoded: boolean;

  constructor(
    length: number,
    signed: boolean,
    endianess?: Endianess,
    isBCDEncoded?: boolean,
    isASCIIEncoded?: boolean,
  ) {
    this.length = length;
    this.signed = signed;
    this.endianess = endianess;
    this.isBCDEncoded = isBCDEncoded || false;
    this.isASCIIEncoded = isASCIIEncoded || false;
  }

  toString() {
    return `[Type length=${this.length} isSigned=${this.signed} endian=${this.endianess} bcd=${this.isBCDEncoded}]`;
  }
}

export enum OffsetType {
  RELATIVE,
  ABSOLUTE,
}

export class Offset {
  public base: number;

  public type: OffsetType;

  constructor(type: OffsetType, base: number) {
    this.base = base;
    this.type = type;
  }

  toString(): string {
    return `Offset ${this.type === OffsetType.ABSOLUTE ? "absolute=" : "relative+"} ${this.base}`;
  }
}

export class Field {
  public type: BitwiseType;

  public name?: string;

  public length: number;

  public offset?: Offset;

  constructor(type: BitwiseType, name?: string, length?: number, offset?: Offset) {
    this.type = type;
    this.name = name;
    this.length = length ?? 1;
    this.offset = offset;
  }

  get byteLength(): number {
    return this.type.length * this.length;
  }

  toString() {
    return `[Field name=${this.name} type=${this.type} length=${this.length} offset=${this.offset}]`;
  }
}

export class Mask {
  public name: string;

  public bitLength: number;

  public bitOffset: number | undefined;

  constructor(name: string, bitLength: number, bitOffset?: number) {
    this.name = name;
    this.bitLength = bitLength;
    this.bitOffset = bitOffset;
  }

  toString() {
    return `[Mask name=${this.name} length=${this.bitLength} offset=${this.bitOffset}]`;
  }
}

export class FieldMask extends Field {
  public masks: Mask[];

  constructor(type: BitwiseType, name: string, length?: number, offset?: Offset) {
    super(type, name, length, offset);
    this.masks = [];
  }

  add(mask: Mask) {
    let usedBitCount = 0;
    for (let i = 0; i < this.masks.length; i += 1) {
      usedBitCount += this.masks[i].bitLength;
    }

    if (usedBitCount + mask.bitLength > this.type.length * 8) {
      throw new Error(`Mask ${mask.name} on field ${this.name} doesn't fit`);
    }

    // eslint-disable-next-line no-param-reassign
    mask.bitOffset = 8 - (usedBitCount + mask.bitLength);

    this.masks.push(mask);
  }

  toString() {
    return `[MaskedField name=${this.name} type=${this.type} length=${this.length} masks=${this.masks}]`;
  }
}

export class Struct {
  public name: string;

  public length: number;

  public fields: Field[];

  public offset?: Offset;

  constructor(name: string, length?: number, offset?: Offset) {
    this.name = name;
    this.length = length ?? 1;
    this.fields = [];
    this.offset = offset;
  }

  get byteLength(): number {
    let innerByteLength = 0;
    for (let i = 0; i < this.fields.length; i += 1) {
      innerByteLength += this.fields[i].byteLength;
    }

    return innerByteLength * this.length;
  }

  addField(f: Field) {
    this.fields.push(f);
  }

  toString() {
    return `[Struct name=${this.name} length=${this.length} fields=${this.fields} offset=${this.offset}]`;
  }
}

export class Comment {
  public message: string;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return `[Comment message=${this.message}]`;
  }
}
