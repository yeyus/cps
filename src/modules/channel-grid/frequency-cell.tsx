import * as React from "react";

import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";
import { CellContext } from "@tanstack/react-table";
import UnitHzIcon from "@/icons/unit-hz";
import UnitMhzIcon from "@/icons/unit-mhz";
import UnitKhzIcon from "@/icons/unit-khz";

import styles from "./frequency-cell.module.css";

type FrequencyUnits = "Mhz" | "Khz" | "Hz";

const selectFrequencyUnit = (value: bigint, forceUnit?: FrequencyUnits): FrequencyUnits => {
  if (forceUnit) {
    return forceUnit;
  }
  if (value > BigInt(3000000)) {
    return "Mhz";
  }
  if (value > BigInt(50000)) {
    return "Khz";
  }
  return "Hz";
};

function FrequencyLabel({
  frequency,
  forceUnit,
  ...props
}: { frequency: bigint; forceUnit?: FrequencyUnits } & React.HTMLProps<HTMLSpanElement>) {
  const unit = selectFrequencyUnit(frequency, forceUnit);
  let renderValue = Number(frequency);
  let icon = <UnitHzIcon className={styles.unitIcon} />;
  if (unit === "Mhz") {
    renderValue /= 1000000.0;
    icon = <UnitMhzIcon className={styles.unitIcon} />;
  } else if (unit === "Khz") {
    renderValue /= 1000.0;
    icon = <UnitKhzIcon className={styles.unitIcon} />;
  }
  return (
    <span {...props}>
      {unit === "Mhz"
        ? Intl.NumberFormat(navigator.language, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 6,
          }).format(renderValue)
        : renderValue.toString()}{" "}
      {icon}
    </span>
  );
}

export default function FrequencyCell(props: CellContext<ChannelSlot, bigint | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const frequency = props.getValue();
  if (frequency === undefined || frequency === BigInt(0)) return null;

  return <FrequencyLabel frequency={frequency} className={styles.label} />;
}
