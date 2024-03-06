import * as React from "react";
import { CellContext } from "@tanstack/react-table";

import Pill from "@modules/ui/pill";
import { ChannelSlot, Mode } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./channel-mode-cell.module.css";

const CHANNEL_MODE: Record<Mode, [string, string]> = {
  [Mode.AM]: ["AM", styles.modeAM],
  [Mode.FM]: ["FM", styles.modeFM],
  [Mode.NFM]: ["FM", styles.modeFM],
  [Mode.WFM]: ["FM", styles.modeFM],
  [Mode.SSB]: ["SSB", styles.modeSSB],
  [Mode.USB]: ["USB", styles.modeUSB],
  [Mode.LSB]: ["LSB", styles.modeLSB],
  [Mode.DMR]: ["DMR", styles.modeDMR],
  [Mode.P25]: ["P25", styles.modeP25],
  [Mode.DSTAR]: ["DSTAR", styles.modeDSTAR],
  [Mode.C4FM]: ["C4FM", styles.modeC4FM],
  [Mode.M17]: ["M17", styles.modeM17],
  [Mode.NXDN]: ["NXDN", styles.modeNXDN],
};

export default function ChannelModeCell(props: CellContext<ChannelSlot, Mode | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const channelMode = props.getValue();
  if (channelMode === undefined) return null;

  const label = CHANNEL_MODE[channelMode];
  if (label != null) {
    return <Pill className={label[1]}>{label[0]}</Pill>;
  }

  return <Pill>Unknown</Pill>;
}
