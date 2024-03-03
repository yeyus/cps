import { ConnectionAction, ConnectionState, ConnectionStatus } from "./types";

export default function connectionReducer(state: ConnectionState, action: ConnectionAction): ConnectionState {
  switch (action.type) {
    case "CONNECTION_OPEN":
      return {
        status: ConnectionStatus.CONNECTED,
        radio: action.radio,
      };
    case "CONNECTION_CLOSE":
      return {
        status: ConnectionStatus.DISCONNECTED,
        radio: null,
      };
    case "CONNECTION_ERROR":
      return {
        status: ConnectionStatus.DISCONNECTED,
        radio: null,
        error: action.error,
      };
    default:
      throw new Error("Unhandled action type at ConnectionManager");
  }
}
