import getLogger from "@utils/logger";

import { SerialRadio } from "@modules/radio-types/transports/serial/serial";
import { Transport } from "@modules/radio-types/base";

import { ConnectionAction, ConnectionState, ConnectionStatus } from "./types";

const logger = getLogger("ConnectSerialRadioAction");

export const ConnectSerialRadioAction = (dispatch: React.Dispatch<ConnectionAction>, radio: SerialRadio): void => {
  // try to open serial port
  const { connection } = radio;
  logger.log(`Opening serial port #${connection.index}...`);

  connection.on("open", () => dispatch({ type: "CONNECTION_OPEN", radio }));
  connection.on("disconnect", () => dispatch({ type: "CONNECTION_CLOSE" }));
  connection.on("error", (error) => dispatch({ type: "CONNECTION_ERROR", error }));

  connection.open();
};

export const DisconnectSerialRadioAction = (
  dispatch: React.Dispatch<ConnectionAction>,
  state: ConnectionState,
): void => {
  if (
    state.status === ConnectionStatus.DISCONNECTED ||
    state.radio === null ||
    state.radio.transport !== Transport.SERIAL
  )
    return;

  const serialRadio = state.radio as SerialRadio;
  const { connection } = serialRadio;
  logger.log(`Closing serial port ${connection.index}...`);

  connection.close().then(() => {
    dispatch({ type: "CONNECTION_CLOSE" });
  });
};
