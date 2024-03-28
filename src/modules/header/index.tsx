import * as React from "react";
import classnames from "classnames";
import type { HTMLAttributes } from "react";
import { FaFileImport } from "react-icons/fa";

import AppVersion from "@modules/app-version";
import ThemeSwitcher from "@modules/theme-switcher";
import HeaderButton from "@modules/ui/header-button";

import styles from "./header.module.css";

export default function Header({ className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={classnames(className, styles.header)}>
      <nav className={classnames(styles.itemsContainer, styles.itemsLeft)}>
        <HeaderButton>
          <FaFileImport size={26} />
        </HeaderButton>
        <HeaderButton>
          <FaFileImport size={26} />
        </HeaderButton>
      </nav>
      <nav className={classnames(styles.itemsContainer, styles.itemsRight)}>
        <HeaderButton>
          <FaFileImport size={26} />
        </HeaderButton>
        <AppVersion />
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
