import * as React from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";
import { ChannelSlot } from "../../proto/gen/cps/model/v1/channel_pb";

import styles from "./table.module.css";

const columnHelper = createColumnHelper<ChannelSlot>();

const columns = [
  columnHelper.display({
    id: "id",
    cell: (props) => props.row.index + 1,
  }),
  columnHelper.accessor("channel.name", {
    cell: (name) => name.getValue(),
  }),
  columnHelper.accessor("channel.mode", {
    cell: (props) => props.getValue()?.toString(),
  }),
  columnHelper.accessor("channel.frequency", {
    cell: (props) => (!props.row.original.isEmpty ? props.getValue().toString(10) : null),
  }),
  columnHelper.accessor("channel.offset", {
    cell: (props) => (!props.row.original.isEmpty ? props.getValue()?.toString(10) : null),
  }),
  columnHelper.accessor("channel.step", {
    cell: (props) => (!props.row.original.isEmpty ? props.getValue()?.toString(10) : null),
  }),
  columnHelper.accessor("channel.comment", {
    cell: (props) => props.getValue(),
  }),
];

export default function ChannelGridTable({ channelSlots }: { channelSlots: ChannelSlot[] }) {
  const table = useReactTable({ data: channelSlots, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={headerGroup.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className={classNames({ [styles.emptyChannelSlow]: row.original.isEmpty })}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
