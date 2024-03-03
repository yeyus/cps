import * as React from "react";
import connectionReducer from "./reducer";
import { ConnectionDispatch, ConnectionProviderProps, ConnectionState, ConnectionStatus } from "./types";

const INITIAL_STATE: ConnectionState = {
  status: ConnectionStatus.DISCONNECTED,
  radio: null,
};

const ConnectionContext = React.createContext<{ state: ConnectionState; dispatch: ConnectionDispatch } | undefined>(
  undefined,
);

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [state, dispatch] = React.useReducer(connectionReducer, INITIAL_STATE);

  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnection() {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
}
