import * as React from "react";

export type Theme = "light" | "dark" | "system";

export type ThemeAction = { type: "THEME_SWITCH"; theme: Theme } | { type: "THEME_TOGGLE" };

export type ThemeDispatch = (action: ThemeAction) => void;
export type ThemeProviderProps = { children: React.ReactNode };

export interface ThemeState {
  theme: Theme;
}

const INITIAL_STATE: ThemeState = {
  theme: "system",
};

const ThemeContext = React.createContext<{ state: ThemeState; dispatch: ThemeDispatch } | undefined>(undefined);

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "THEME_SWITCH":
      return {
        theme: action.theme,
      };
    case "THEME_TOGGLE":
      if (state.theme === "system") break;
      return {
        theme: state.theme === "dark" ? "light" : "dark",
      };
    default:
      throw new Error("Unhandled action type for ThemeStore");
  }

  return state;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [state, dispatch] = React.useReducer(themeReducer, INITIAL_STATE);

  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function useSystemTheme(): Theme {
  const [isDarkTheme, setIsDarkTheme] = React.useState(getCurrentTheme());

  const handleChange = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkTheme ? "dark" : "light";
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  const systemTheme = useSystemTheme();

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context.state.theme === "system" ? systemTheme : context.state.theme;
}

export function useThemeStore() {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
