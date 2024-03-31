import * as React from "react";

import { RadioDefinition } from "@configs/radio-config";
import { RadioTransports } from "@modules/radio-types/transports";

export type RadioAction = { type: "SELECT_RADIO"; radio: RadioDefinition<RadioTransports> } | { type: "CLEAR_RADIO" };

export type RadioDispatch = (action: RadioAction) => void;
export type RadioProviderProps = { children: React.ReactNode };

export interface RadioState {
  radio?: RadioDefinition<RadioTransports>;
}

const INITIAL_STATE: RadioState = {};

const RadioContext = React.createContext<{ state: RadioState; dispatch: RadioDispatch } | undefined>(undefined);

function radioReducer(state: RadioState, action: RadioAction): RadioState {
  switch (action.type) {
    case "SELECT_RADIO":
      return {
        radio: action.radio,
      };
    case "CLEAR_RADIO":
      return {};
    default:
      throw new Error("Unhandled action type for RadioStore");
  }

  return state;
}

export const selectRadioAction = (
  dispatch: React.Dispatch<RadioAction>,
  radio: RadioDefinition<RadioTransports>,
): void => {
  dispatch({ type: "SELECT_RADIO", radio });
};

export function RadioProvider({ children }: RadioProviderProps) {
  const [state, dispatch] = React.useReducer(radioReducer, INITIAL_STATE);

  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const context = React.useContext(RadioContext);

  if (context === undefined) {
    throw new Error("useRadio must be used within a RadioProvider");
  }

  return { radio: context.state.radio, dispatch: context.dispatch };
}
