import { Codeplug } from "../../proto/gen/cps/model/v1/codeplug_pb";
import { CodeplugAction, CodeplugState } from "./types";

export default function connectionReducer(state: CodeplugState, action: CodeplugAction): CodeplugState {
  switch (action.type) {
    case "CODEPLUG_LOAD":
      return {
        originalCodeplug: action.codeplug,
        loadedAt: Date.now(),
        codeplug: new Codeplug(action.codeplug),
        hasChanges: false,
      };
    case "CODEPLUG_UPDATE":
      return {
        ...state,
        codeplug: action.codeplug,
        hasChanges: true,
        lastChange: Date.now(),
      };
    case "CODEPLUG_CLOSE":
      return {
        hasChanges: false,
      };
    default:
      throw new Error("Unhandled action type at CodeplugManager");
  }
}
