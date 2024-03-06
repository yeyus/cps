import * as React from "react";

import classNames from "classnames";
import { Switch } from "@headlessui/react";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";
import { themeSwitch, useTheme, useThemeStore } from "@stores/theme";

import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher({ className }: { className?: string }) {
  const currentTheme = useTheme();
  const { dispatch } = useThemeStore();
  const isLight = currentTheme === "light";

  const handleClick = () => {
    themeSwitch(dispatch, isLight ? "dark" : "light");
  };

  return (
    <div>
      <Switch checked={isLight} onChange={handleClick} className={classNames(className, styles.switcher)}>
        <span className="sr-only">Toggle to {isLight ? "dark" : "light"} theme</span>
        <span className={classNames({ [styles.checked]: isLight, [styles.unchecked]: !isLight }, styles.thumb)}>
          {isLight ? <HiOutlineSun size="24" color="black" /> : <HiMoon size="24" color="yellow" />}
        </span>
      </Switch>
    </div>
  );
}
