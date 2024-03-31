import * as React from "react";
import classnames from "classnames";
import type { HTMLAttributes } from "react";
import { FaFileImport } from "react-icons/fa";
import NiceModal from "@ebay/nice-modal-react";

import AppVersion from "@modules/app-version";
import ThemeSwitcher from "@modules/theme-switcher";
import HeaderButton from "@modules/ui/header-button";
import CodeplugImportModal from "@modules/codeplug-file-import/modal";

import { useRadio } from "@stores/radio";
import styles from "./header.module.css";

export default function Header({ className }: HTMLAttributes<HTMLDivElement>) {
  const { radio } = useRadio();

  const handleImportClick = () => {
    NiceModal.show(CodeplugImportModal, {});
  };

  return (
    <header className={classnames(className, styles.header)}>
      <nav className={classnames(styles.itemsContainer, styles.itemsLeft)}>
        {radio != null && (
          <HeaderButton tooltipText="Import codeplug" tooltipPlacement="bottom-start" onClick={handleImportClick}>
            <FaFileImport size={26} />
          </HeaderButton>
        )}
      </nav>
      <nav className={classnames(styles.itemsContainer, styles.itemsRight)}>
        <AppVersion />
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
