import * as React from "react";
import classNames from "classnames";

import styles from "./pill.module.css";

interface PillProps {
  className?: string;
}

export default function Pill({ className, children }: React.PropsWithChildren<PillProps>) {
  return <span className={classNames(className, styles.pill)}>{children}</span>;
}
