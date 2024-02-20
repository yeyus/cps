/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

import { ASTNode, ASTNodeTerminal, HasByteLength, NodeTypes } from "./base";

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

type Member = PrimitiveTypeField | MaskedField | Struct | StructFieldReference;

export class Script extends ASTNode {
  constructor() {
    super(NodeTypes.SCRIPT);
    this.children = [];
  }

  public add(node: ASTNode) {
    this.children.push(node);
  }
}

export class Offset extends ASTNodeTerminal {
  public base: number;

  public type: OffsetType;

  constructor(type: OffsetType, base: number) {
    super(NodeTypes.OFFSET);
    this.base = base;
    this.type = type;
  }

  toString(): string {
    return `Offset ${this.type === OffsetType.ABSOLUTE ? "absolute=" : "relative+"} ${this.base}`;
  }
}

export class PrimitiveTypeField extends ASTNodeTerminal implements HasByteLength {
  public type: BitwiseType;

  public name: string;

  public length: number;

  public offset?: Offset;

  constructor(type: BitwiseType, name: string, length?: number, offset?: Offset) {
    super(NodeTypes.PRIMITIVE_TYPE_FIELD);
    this.type = type;
    this.name = name;
    this.length = length ?? 1;
    this.offset = offset;
  }

  get byteLength(): number {
    return this.type.length * this.length;
  }

  toString() {
    return `[PrimitiveTypeField name=${this.name} type=${this.type} length=${this.length} offset=${this.offset}]`;
  }
}

export class Mask extends ASTNodeTerminal {
  public name: string;

  public bitLength: number;

  public bitOffset: number | undefined;

  constructor(name: string, bitLength: number, bitOffset?: number) {
    super(NodeTypes.MASK);
    this.name = name;
    this.bitLength = bitLength;
    this.bitOffset = bitOffset;
  }

  toString() {
    return `[Mask name=${this.name} length=${this.bitLength} offset=${this.bitOffset}]`;
  }
}

export class MaskedField extends ASTNode implements HasByteLength {
  public type: BitwiseType;

  public offset?: Offset;

  public declare children?: Mask[];

  constructor(type: BitwiseType, offset?: Offset) {
    super(NodeTypes.FIELD_MASK);
    this.type = type;
    this.offset = offset;
    this.children = [];
  }

  get byteLength(): number {
    return this.type.length;
  }

  add(mask: Mask) {
    let usedBitCount = 0;
    for (let i = 0; i < this.children.length; i += 1) {
      usedBitCount += this.children[i].bitLength;
    }

    if (usedBitCount + mask.bitLength > this.type.length * 8) {
      throw new Error(`Mask ${mask.name} doesn't fit`);
    }

    // eslint-disable-next-line no-param-reassign
    mask.bitOffset = 8 - (usedBitCount + mask.bitLength);

    this.children.push(mask);
  }

  toString() {
    return `[MaskedField type=${this.type} masks=${this.children}]`;
  }
}

export class StructDefinition extends ASTNode implements HasByteLength {
  public name: string;

  public declare children: Member[];

  constructor(name: string) {
    super(NodeTypes.STRUCT_DEFINITION);
    this.name = name;
    this.children = [];
  }

  get byteLength(): number {
    let innerByteLength = 0;
    for (let i = 0; i < this.children.length; i += 1) {
      innerByteLength += this.children[i].byteLength;
    }

    return innerByteLength;
  }

  addMember(f: Member) {
    this.children.push(f);
  }

  toString() {
    return `[StructDefinition name=${this.name} fields=${this.children}]`;
  }
}

export class Struct extends StructDefinition {
  public length: number;

  public offset?: Offset;

  constructor(name: string, length?: number, offset?: Offset) {
    super(name);
    this.length = length ?? 1;
    this.offset = offset;
  }

  get byteLength(): number {
    return super.byteLength * this.length;
  }

  toString() {
    return `[Struct name=${this.name} length=${this.length} fields=${this.children} offset=${this.offset}]`;
  }
}

export class StructFieldReference extends ASTNodeTerminal implements HasByteLength {
  public structName: string;

  public name: string;

  public length: number;

  public offset?: Offset;

  public definition?: StructDefinition;

  constructor(name: string, structName: string, length?: number, offset?: Offset) {
    super(NodeTypes.STRUCT_REFERENCE);
    this.name = name;
    this.structName = structName;
    this.length = length ?? 1;
    this.offset = offset;
  }

  public attachDefinition(definition: StructDefinition) {
    this.definition = definition;
  }

  get byteLength(): number {
    if (this.definition == null) {
      throw new Error(`No ${this.structName} definition attached to ${this.name}`);
    }
    return this.definition.byteLength * this.length;
  }

  toString() {
    return `[StructFieldReference structName=${this.structName} name=${this.name} length=${this.length} offset=${this.offset}]`;
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

export type DefinitionTable = Map<string, StructDefinition>;
