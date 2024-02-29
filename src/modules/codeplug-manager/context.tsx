import * as React from "react";
import codeplugReducer from "./reducer";
import { CodeplugState, CodeplugDispatch, CodeplugProviderProps } from "./types";

const INITIAL_STATE: CodeplugState = {
  hasChanges: false,
};

const CodeplugContext = React.createContext<{ state: CodeplugState; dispatch: CodeplugDispatch } | undefined>(
  undefined,
);

export function CodeplugProvider({ children }: CodeplugProviderProps) {
  const [state, dispatch] = React.useReducer(codeplugReducer, INITIAL_STATE);

  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <CodeplugContext.Provider value={value}>{children}</CodeplugContext.Provider>;
}

export function useCodeplug() {
  const context = React.useContext(CodeplugContext);
  if (context === undefined) {
    throw new Error("useCodeplug must be used within a CodeplugProvider");
  }

  return context;
}
