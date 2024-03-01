import React from "react";
import { CodeplugAction } from "./types";
import { Codeplug } from "../../proto/gen/cps/model/v1/codeplug_pb";
import getLogger from "../../utils/logger";

const logger = getLogger("CodeplugAction");

export const loadCodeplugAction = (dispatch: React.Dispatch<CodeplugAction>, codeplug: Codeplug): void => {
  logger.log(`loading codeplug into codeplug store`);
  dispatch({ type: "CODEPLUG_LOAD", codeplug });
};

export const closeCodeplugAction = (dispatch: React.Dispatch<CodeplugAction>): void => {
  logger.log(`resetting codeplug store`);
  dispatch({ type: "CODEPLUG_CLOSE" });
};
