import * as React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Switch } from "@headlessui/react";
import { useThemeStore } from "@stores/theme";

function SystemThemeCheckbox() {
    
}

export default function ThemeSwitcher() {
  const { state } = useThemeStore();

  const handleClick = () => {};

  return (
    <div>
      <input type="checkbox" />
      <Switch disabled={state.theme === "system"} onChange={handleClick} />
    </div>
  );
}
