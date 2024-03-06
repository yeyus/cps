import * as React from "react";
import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import SlotMRIcon from "@/icons/slot-mr";
import SlotVFOIcon from "@/icons/slot-vfo";
import { ChannelSlot, ChannelSlotType } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./slot-type-cell.module.css";

export default function SlotTypeCell(props: CellContext<ChannelSlot, ChannelSlotType | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  switch (props.getValue()) {
    case ChannelSlotType.MEMORY:
      return <SlotMRIcon className={classNames(styles.slotTypeCell, styles.slotTypeIcon)} />;
    case ChannelSlotType.VFO:
      return <SlotVFOIcon className={classNames(styles.slotTypeCell, styles.slotTypeIcon)} />;
    default:
      return "?";
  }
}
