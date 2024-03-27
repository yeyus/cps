import * as React from "react";
import classNames from "classnames";
import { createColumnHelper } from "@tanstack/react-table";

import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";

import SlotTypeCell from "./cells/slot-type-cell";
import ChannelModeCell from "./cells/channel-mode-cell";
import FrequencyCell from "./cells/frequency-cell";
import ToneSquelchCell from "./cells/tone-squelch-cell";
import PowerCell from "./cells/power-cell";

import styles from "./table.module.css";

const columnHelper = createColumnHelper<ChannelSlot>();

export const COLUMN_ICON_SIZE = 20;

export default [
  columnHelper.display({
    id: "id",
    header: "Slot",
    cell: (props) => (
      <div key={props.cell.id} className={classNames(styles.cellAlignCenter, styles.columnRecordNumber)}>
        {props.row.index + 1}
      </div>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: SlotTypeCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: styles.cellAlignCenter,
    },
  }),
  columnHelper.accessor("channel.name", {
    header: "Name",
    cell: (name) => name.getValue(),
    meta: {
      tdClassName: styles.cellNoWrap,
    },
  }),
  columnHelper.accessor("channel.mode", {
    header: "Mode",
    cell: ChannelModeCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: styles.cellAlignCenter,
    },
  }),
  columnHelper.accessor("channel.power", {
    header: "Power",
    cell: PowerCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: styles.cellAlignCenter,
    },
  }),
  columnHelper.accessor("channel.frequency", {
    header: "Frequency",
    cell: FrequencyCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: classNames(styles.cellTabularNums, styles.cellAlignRight),
    },
  }),
  columnHelper.accessor("channel.offset", {
    header: "Offset",
    cell: FrequencyCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: classNames(styles.cellTabularNums, styles.cellAlignRight),
    },
  }),
  columnHelper.accessor("channel.step", {
    header: "Step",
    cell: FrequencyCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: classNames(styles.cellTabularNums, styles.cellAlignRight),
    },
  }),
  columnHelper.accessor("channel.rxTone", {
    header: "Rx Tone",
    cell: ToneSquelchCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: styles.cellAlignCenter,
    },
  }),
  columnHelper.accessor("channel.txTone", {
    header: "Tx Tone",
    cell: ToneSquelchCell,
    meta: {
      thClassName: styles.cellAlignCenter,
      tdClassName: styles.cellAlignCenter,
    },
  }),
  columnHelper.accessor("channel.comment", {
    header: "Comment",
    cell: (props) => props.getValue(),
  }),
];
