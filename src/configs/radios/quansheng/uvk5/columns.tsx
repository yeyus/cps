import * as React from "react";
import Select from "@modules/ui/select";

import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";
import { createColumnHelper } from "@tanstack/react-table";
import CheckboxCell from "@/modules/channel-grid/cells/checkbox-cell";

import selectStyles from "@modules/ui/select.module.css";
import { SCRAMBLER_VALUES } from "./values";

export default function getExtraColumns() {
  const columnHelper = createColumnHelper<ChannelSlot>();
  return [
    columnHelper.accessor("channel.uvk5CustomChannelParams.isScanlist1", {
      header: "Scanlist 1",
      cell: CheckboxCell,
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isScanlist2", {
      header: "Scanlist 2",
      cell: CheckboxCell,
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.bclo", {
      header: "BCLO",
      cell: CheckboxCell,
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.frequencyReverse", {
      header: "Frequency Reverse",
      cell: CheckboxCell,
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.scrambler", {
      header: "Scrambler",
      cell: (cell) => {
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
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.isDtmf", {
      header: "DTMF",
      cell: CheckboxCell,
    }),
    columnHelper.accessor("channel.uvk5CustomChannelParams.dtmfPttId", {
      header: "DTMF PTT ID",
      cell: (cell) => cell.getValue(),
    }),
  ];
}
