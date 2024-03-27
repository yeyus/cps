import * as React from "react";
import { CellContext, ColumnDefTemplate, createColumnHelper } from "@tanstack/react-table";
import { TbHexagonLetterR } from "react-icons/tb";

import { ChannelSlot, ChannelSlotType } from "@/proto/gen/cps/model/v1/channel_pb";

import CheckboxCell from "@modules/channel-grid/cells/checkbox-cell";
import UnsupportedCell from "@modules/channel-grid/cells/unsupported-cell";
import tableStyles from "@modules/channel-grid/table.module.css";
import Select from "@modules/ui/select";
import Tooltip from "@modules/ui/tooltip";
import selectStyles from "@modules/ui/select.module.css";

import { COLUMN_ICON_SIZE } from "@modules/channel-grid/columns";
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
        columnTooltip: (
          <Tooltip
            tooltipRenderer={() =>
              "Menu 25: S-ADD 1. This channel will be included in the Scan pattern when Scanlist 1 is selected."
            }
          >
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isScanlist2", {
      header: "Scanlist 2",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        columnTooltip: (
          <Tooltip
            tooltipRenderer={() =>
              "Menu 26: S-ADD 2. This channel will be included in the Scan pattern when Scanlist 2 is selected."
            }
          >
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.bclo", {
      header: "BCLO",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        columnTooltip: (
          <Tooltip
            tooltipRenderer={() =>
              "Menu 12: BCL. Busy Channel LOck, the radio will not allow transmit while the frequency is in use. "
            }
          >
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.frequencyReverse", {
      header: "Frequency Reverse",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        columnTooltip: (
          <Tooltip tooltipRenderer={() => "Keys F+8. Reverse mode. Receive and transmit frequency reverse."}>
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
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
        columnTooltip: (
          <Tooltip
            tooltipRenderer={() =>
              "Menu 11: SCR. Modifies the voice carrier to obscure voice communication. UV-K5 supports 10 different voice scrambling modes."
            }
          >
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
      },
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isDtmf", {
      header: "DTMF Decode",
      cell: rowFilter(CheckboxCell, (original) => original.type === ChannelSlotType.MEMORY),
      meta: {
        tdClassName: tableStyles.cellAlignCenter,
        columnTooltip: (
          <Tooltip tooltipRenderer={() => "Menu 43: D-DCD. Decode DTMF sequences sent by another radio."}>
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
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
        columnTooltip: (
          <Tooltip
            tooltipRenderer={() =>
              "Menu 42: PTT-ID. DTMF PTT-ID TX Mode（OFF: Close, BOT: Press PTT to send UP CODE, EOT: Release PTT to send DOWN CODE, BOTH: Press or release PTT to send.）"
            }
          >
            <TbHexagonLetterR size={COLUMN_ICON_SIZE} />
          </Tooltip>
        ),
      },
    }),
  ];
}
