import * as React from "react";
import {
  ColumnDef,
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { ChannelSlot } from "../../proto/gen/cps/model/v1/channel_pb";

import SlotTypeCell from "./cells/slot-type-cell";
import ChannelModeCell from "./cells/channel-mode-cell";
import FrequencyCell from "./cells/frequency-cell";
import ToneSquelchCell from "./cells/tone-squelch-cell";
import PowerCell from "./cells/power-cell";

import styles from "./table.module.css";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    thClassName?: string;
    tdClassName?: string;
    isCustomColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<ChannelSlot>();

const columns = [
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

export default function ChannelGridTable({
  channelSlots,
  extraColumns,
}: {
  channelSlots: ChannelSlot[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraColumns: ColumnDef<ChannelSlot, any>[];
}) {
  const table = useReactTable({
    data: channelSlots,
    columns: [...columns, ...extraColumns],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={styles.tableBody}>
      <thead className={styles.tableHeader}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={`tr-head-${headerGroup.id}`}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={classNames(styles.tableHeaderCell, header.column.columnDef.meta?.thClassName)}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={`tr-body-${row.id}`}
            className={classNames(styles.tableRow, { [styles.emptyChannelSlow]: row.original.isEmpty })}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={classNames(styles.tableCell, cell.column.columnDef.meta?.tdClassName)}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
