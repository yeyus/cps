import * as React from "react";
import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import Pill from "@modules/ui/pill";
import { ChannelSlot, Power } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./power-cell.module.css";

export default function PowerCell(props: CellContext<ChannelSlot, Power | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const power = props.getValue();
  if (power === undefined) return null;

  return (
    <Pill
      className={classNames(
        styles.power,
        power.milliwatts != null
          ? {
              [styles.level0]: power.milliwatts <= 1000,
              [styles.level1]: power.milliwatts > 1000 && power.milliwatts <= 3000,
              [styles.level2]: power.milliwatts > 3000 && power.milliwatts <= 5000,
              [styles.level3]: power.milliwatts > 5000 && power.milliwatts <= 10000,
              [styles.level4]: power.milliwatts > 10000 && power.milliwatts <= 25000,
              [styles.level5]: power.milliwatts > 25000 && power.milliwatts <= 50000,
              [styles.level6]: power.milliwatts > 50000 && power.milliwatts <= 100000,
              [styles.level7]: power.milliwatts > 100000,
            }
          : null,
      )}
    >
      <span className={styles.text}>
        {power.label} {power.milliwatts != null ? `${power.milliwatts / 1000}W` : ""}
      </span>
    </Pill>
  );
}
