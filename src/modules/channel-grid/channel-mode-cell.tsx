import * as React from "react";
import { CellContext } from "@tanstack/react-table";
import { PiWaveSine, PiWaveSquare } from "react-icons/pi";

import Pill from "@modules/ui/pill";
import { ChannelSlot, Mode } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./channel-mode-cell.module.css";

const CHANNEL_MODE: Record<Mode, [string, "analog" | "digital", string]> = {
  [Mode.AM]: ["AM", "analog", styles.modeAM],
  [Mode.FM]: ["FM", "analog", styles.modeFM],
  [Mode.NFM]: ["FM", "analog", styles.modeFM],
  [Mode.WFM]: ["FM", "analog", styles.modeFM],
  [Mode.SSB]: ["SSB", "analog", styles.modeSSB],
  [Mode.USB]: ["USB", "analog", styles.modeUSB],
  [Mode.LSB]: ["LSB", "analog", styles.modeLSB],
  [Mode.DMR]: ["DMR", "digital", styles.modeDMR],
  [Mode.P25]: ["P25", "digital", styles.modeP25],
  [Mode.DSTAR]: ["DSTAR", "digital", styles.modeDSTAR],
  [Mode.C4FM]: ["C4FM", "digital", styles.modeC4FM],
  [Mode.M17]: ["M17", "digital", styles.modeM17],
  [Mode.NXDN]: ["NXDN", "digital", styles.modeNXDN],
};

export default function ChannelModeCell(props: CellContext<ChannelSlot, Mode | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const channelMode = props.getValue();
  if (channelMode === undefined) return null;

  const label = CHANNEL_MODE[channelMode];
  if (label != null) {
    return (
      <Pill className={label[2]}>
        <span>{label[1] === "analog" ? <PiWaveSine /> : <PiWaveSquare />}</span>
        <span className={styles.text}>{label[0]}</span>
      </Pill>
    );
  }

  return <Pill>Unknown</Pill>;
}
