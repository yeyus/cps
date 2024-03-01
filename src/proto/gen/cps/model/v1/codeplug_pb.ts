// @generated by protoc-gen-es v1.7.2 with parameter "target=ts"
// @generated from file cps/model/v1/codeplug.proto (package cps.model.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { ChannelSlot } from "./channel_pb.ts";

/**
 * @generated from enum cps.model.v1.RadioType
 */
export enum RadioType {
  /**
   * @generated from enum value: QUANSHENG_UVK5_V0 = 0;
   */
  QUANSHENG_UVK5_V0 = 0,
}
// Retrieve enum metadata with: proto3.getEnumType(RadioType)
proto3.util.setEnumType(RadioType, "cps.model.v1.RadioType", [
  { no: 0, name: "QUANSHENG_UVK5_V0" },
]);

/**
 * @generated from message cps.model.v1.RadioIdentification
 */
export class RadioIdentification extends Message<RadioIdentification> {
  /**
   * @generated from field: cps.model.v1.RadioType definition = 1;
   */
  definition = RadioType.QUANSHENG_UVK5_V0;

  /**
   * @generated from field: string brand = 2;
   */
  brand = "";

  /**
   * @generated from field: string model = 3;
   */
  model = "";

  /**
   * @generated from field: string revision = 4;
   */
  revision = "";

  /**
   * @generated from field: optional string serial_number = 5;
   */
  serialNumber?: string;

  /**
   * @generated from field: optional string firmware_version = 6;
   */
  firmwareVersion?: string;

  /**
   * @generated from field: optional string hardware_version = 7;
   */
  hardwareVersion?: string;

  constructor(data?: PartialMessage<RadioIdentification>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cps.model.v1.RadioIdentification";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "definition", kind: "enum", T: proto3.getEnumType(RadioType) },
    { no: 2, name: "brand", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "model", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "revision", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "serial_number", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 6, name: "firmware_version", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 7, name: "hardware_version", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RadioIdentification {
    return new RadioIdentification().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RadioIdentification {
    return new RadioIdentification().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RadioIdentification {
    return new RadioIdentification().fromJsonString(jsonString, options);
  }

  static equals(a: RadioIdentification | PlainMessage<RadioIdentification> | undefined, b: RadioIdentification | PlainMessage<RadioIdentification> | undefined): boolean {
    return proto3.util.equals(RadioIdentification, a, b);
  }
}

/**
 * @generated from message cps.model.v1.Codeplug
 */
export class Codeplug extends Message<Codeplug> {
  /**
   * identification section 
   *
   * @generated from field: cps.model.v1.RadioIdentification radio = 1;
   */
  radio?: RadioIdentification;

  /**
   * memory section 
   *
   * @generated from field: repeated cps.model.v1.ChannelSlot channel_slots = 20;
   */
  channelSlots: ChannelSlot[] = [];

  /**
   * metadata section 
   *
   * @generated from field: optional string name = 40;
   */
  name?: string;

  /**
   * @generated from field: optional string comment = 100;
   */
  comment?: string;

  /**
   * links this memory to an upstream entity like a repeater definition, PMR channel, etc.
   *
   * @generated from field: optional string parent_entity = 103;
   */
  parentEntity?: string;

  /**
   * @generated from field: optional google.protobuf.Timestamp created_at = 101;
   */
  createdAt?: Timestamp;

  /**
   * @generated from field: optional google.protobuf.Timestamp updated_at = 102;
   */
  updatedAt?: Timestamp;

  /**
   * @generated from field: optional google.protobuf.Timestamp deleted_at = 104;
   */
  deletedAt?: Timestamp;

  constructor(data?: PartialMessage<Codeplug>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cps.model.v1.Codeplug";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "radio", kind: "message", T: RadioIdentification },
    { no: 20, name: "channel_slots", kind: "message", T: ChannelSlot, repeated: true },
    { no: 40, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 100, name: "comment", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 103, name: "parent_entity", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 101, name: "created_at", kind: "message", T: Timestamp, opt: true },
    { no: 102, name: "updated_at", kind: "message", T: Timestamp, opt: true },
    { no: 104, name: "deleted_at", kind: "message", T: Timestamp, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Codeplug {
    return new Codeplug().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Codeplug {
    return new Codeplug().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Codeplug {
    return new Codeplug().fromJsonString(jsonString, options);
  }

  static equals(a: Codeplug | PlainMessage<Codeplug> | undefined, b: Codeplug | PlainMessage<Codeplug> | undefined): boolean {
    return proto3.util.equals(Codeplug, a, b);
  }
}

