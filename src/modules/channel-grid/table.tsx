import * as React from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";
import { ChannelSlot } from "../../proto/gen/cps/model/v1/channel_pb";

import styles from "./table.module.css";

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
  columnHelper.accessor("channel.name", {
    header: "Name",
    cell: (name) => name.getValue(),
  }),
  columnHelper.accessor("channel.mode", {
    header: "Mode",
    cell: (props) => props.getValue()?.toString(),
  }),
  columnHelper.accessor("channel.frequency", {
    header: "Frequency",
    cell: (props) => (!props.row.original.isEmpty ? props.getValue().toString(10) : null),
  }),
  columnHelper.accessor("channel.offset", {
    header: "Offset",
    cell: (props) => (!props.row.original.isEmpty ? props.getValue()?.toString(10) : null),
  }),
  columnHelper.accessor("channel.step", {
    header: "Step",
    cell: (props) => (!props.row.original.isEmpty ? props.getValue()?.toString(10) : null),
  }),
  columnHelper.accessor("channel.comment", {
    header: "Comment",
    cell: (props) => props.getValue(),
  }),
];

export default function ChannelGridTable({ channelSlots }: { channelSlots: ChannelSlot[] }) {
  const table = useReactTable({ data: channelSlots, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <table className={styles.tableBody}>
      <thead className={styles.tableHeader}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={headerGroup.id} className={styles.tableHeaderCell}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className={classNames(styles.tableRow, { [styles.emptyChannelSlow]: row.original.isEmpty })}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={styles.tableCell}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
