import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";
import { BaseRadioInterface, CodeplugReadResponse, Transport } from "@modules/radio-types/base";
import { Codeplug } from "@proto/cps/model/v1/codeplug_pb";
import { ColumnDef } from "@tanstack/react-table";

export type BrandModelRevision = [string, string, number];

export interface RadioDefinition<T extends BaseRadioInterface> {
  identifiers: BrandModelRevision[];
  transport: Transport;
  image?: string;

  // get factory(): T;
  createRadio(...args: unknown[]): T;

  // parsers
  deserializeCodeplug(readResponse: CodeplugReadResponse): Codeplug;

  // extra grid settings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExtraColumns(): ColumnDef<ChannelSlot, any>[];

  // for serial radios
  serialOptions?: SerialOptions;
}
