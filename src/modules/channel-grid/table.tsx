import * as React from "react";
import { ColumnDef, RowData, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";
import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./table.module.css";
import columns from "./columns";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    thClassName?: string;
    tdClassName?: string;
    columnTooltip?: React.ReactNode;
  }
}

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
                {header.column.columnDef.meta?.columnTooltip != null && header.column.columnDef.meta?.columnTooltip}
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
