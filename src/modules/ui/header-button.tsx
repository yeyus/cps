import * as React from "react";
import type { HTMLAttributes } from "react";
import classNames from "classnames";

import styles from "./header-button.module.css";

export default function HeaderButton({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={classNames(className, styles.button)} {...props}>
      {children}
    </button>
  );
}
