import { CodeplugReadResponse } from "@modules/radio-types/base";
import { Codeplug } from "@proto/cps/model/v1/codeplug_pb";

export interface MemorySerializer {
  deserialize(buffer: CodeplugReadResponse): Codeplug;
  serialize(codeplug: Codeplug): Uint8Array;
}
