import { Codeplug } from "../../proto/gen/cps/model/v1/codeplug_pb";

export type CodeplugAction =
  | { type: "CODEPLUG_LOAD"; codeplug: Codeplug }
  | { type: "CODEPLUG_UPDATE"; codeplug: Codeplug }
  | { type: "CODEPLUG_CLOSE" };

export type CodeplugDispatch = (action: CodeplugAction) => void;
export type CodeplugProviderProps = { children: React.ReactNode };

export interface CodeplugState {
  originalCodeplug?: Codeplug;
  loadedAt?: number;

  codeplug?: Codeplug;
  hasChanges: boolean;
  lastChange?: number;
}
