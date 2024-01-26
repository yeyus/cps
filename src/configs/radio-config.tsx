import { BaseRadioInterface, Transport } from "../modules/radio-types/base";

export type BrandModelRevision = [string, string, number];

export interface RadioDefinition<T extends BaseRadioInterface> {
  identifiers: BrandModelRevision[];
  transport: Transport;
  image?: string;

  // get factory(): T;
  createRadio(...args: unknown[]): T;

  // for serial radios
  serialOptions?: SerialOptions;
}
