import { BaseRadioInterface, CodeplugReadResponse, Transport } from "@modules/radio-types/base";
import { Codeplug } from "@proto/cps/model/v1/codeplug_pb";

export type BrandModelRevision = [string, string, number];

export interface RadioDefinition<T extends BaseRadioInterface> {
  identifiers: BrandModelRevision[];
  transport: Transport;
  image?: string;

  // get factory(): T;
  createRadio(...args: unknown[]): T;

  // parsers
  deserializeCodeplug(readResponse: CodeplugReadResponse): Codeplug;

  // for serial radios
  serialOptions?: SerialOptions;
}
