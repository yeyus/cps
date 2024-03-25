import * as React from "react";
import Select from "@modules/ui/select";

import { ChannelSlot, ChannelSlotType } from "@/proto/gen/cps/model/v1/channel_pb";
import { CellContext, ColumnDefTemplate, createColumnHelper } from "@tanstack/react-table";
import CheckboxCell from "@modules/channel-grid/cells/checkbox-cell";
import UnsupportedCell from "@modules/channel-grid/cells/unsupported-cell";

import tableStyles from "@modules/channel-grid/table.module.css";
import selectStyles from "@modules/ui/select.module.css";
import { DMTF_PTT_ID_VALUES, SCRAMBLER_VALUES } from "./values";

const rowFilter =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: ColumnDefTemplate<CellContext<ChannelSlot, any>>,
    predicate: (original: ChannelSlot) => boolean,
  ): ColumnDefTemplate<CellContext<ChannelSlot, unknown>> =>
  // eslint-disable-next-line react/function-component-definition
  (props: CellContext<ChannelSlot, unknown>): JSX.Element | null =>
    // eslint-disable-next-line no-nested-ternary, react/destructuring-assignment
    predicate(props.row.original) ? typeof children === "string" ? children : children(props) : <UnsupportedCell />;

export default function getExtraColumns() {
  const columnHelper = createColumnHelper<ChannelSlot>();
  return [
    columnHelper.accessor("channel.uvk5CustomChannelParams.isScanlist1", {
      header: "Scanlist 1",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isScanlist2", {
      header: "Scanlist 2",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.bclo", {
      header: "BCLO",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.frequencyReverse", {
      header: "Frequency Reverse",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.scrambler", {
      header: "Scrambler",
      cell: rowFilter(
        (cell: CellContext<ChannelSlot, number | undefined>) => {
          const value = cell.getValue();
          if (value === undefined) return null;

          return (
            <Select
              selectedValue={SCRAMBLER_VALUES[value]}
              values={SCRAMBLER_VALUES}
              onChange={() => {}}
              buttonRenderer={(v) => v?.label}
              optionRenderer={(v) => v?.label}
              className={selectStyles.takeWholeCell}
            />
          );
        },
        (original) => original.type === ChannelSlotType.MEMORY,
      ),
      meta: {
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isDtmf", {
      header: "DTMF Decode",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        isCustomColumn: true,
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.dtmfPttId", {
      header: "DTMF PTT ID",
      cell: rowFilter(
        (cell: CellContext<ChannelSlot, number | undefined>) => {
          const value = cell.getValue();
          if (value === undefined) return null;

          return (
            <Select
              selectedValue={DMTF_PTT_ID_VALUES[value]}
              values={DMTF_PTT_ID_VALUES}
              onChange={() => {}}
              buttonRenderer={(v) => v?.label}
              optionRenderer={(v) => v?.label}
              optionIdRenderer={(v) => v?.value.toString()}
              className={selectStyles.takeWholeCell}
            />
          );
        },
        (original) => original.type === ChannelSlotType.MEMORY,
      ),
      meta: {
        isCustomColumn: true,
      },
    }),
  ];
}
