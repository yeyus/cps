import * as React from "react";
import type { HTMLAttributes } from "react";
import { Placement } from "@floating-ui/react";
import classnames from "classnames";

import styles from "./header-button.module.css";
import Tooltip from "./tooltip";

interface HeaderButtonProps {
  tooltipText?: string;
  tooltipPlacement?: Placement;
}

export default function HeaderButton({
  tooltipText,
  tooltipPlacement,
  className,
  children,
  ...props
}: HeaderButtonProps & HTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip
      tooltipRenderer={tooltipText ? () => tooltipText : undefined}
      tooltipPlacement={tooltipPlacement}
      tooltipClassName={styles.tooltip}
      className={classnames(className, styles.button)}
      {...props}
    >
      {children}
    </Tooltip>
  );
}
