import * as React from "react";
import { CellContext } from "@tanstack/react-table";
import { PiWaveSine, PiWaveSquare } from "react-icons/pi";

import Pill from "@modules/ui/pill";
import { ChannelSlot, ToneSquelch } from "@/proto/gen/cps/model/v1/channel_pb";

import styles from "./tone-squelch-cell.module.css";

export default function ToneSquelchCell(props: CellContext<ChannelSlot, ToneSquelch | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const toneSquelch = props.getValue();
  if (toneSquelch === undefined) return null;

  if (toneSquelch.ctcss != null) {
    return (
      <Pill className={styles.ctcss}>
        <PiWaveSine />
        <span className={styles.text}>CTCSS {(toneSquelch.ctcss / 10).toFixed(1)}Hz</span>
      </Pill>
    );
  }
  if (toneSquelch.dcs != null) {
    return (
      <Pill className={styles.dcs}>
        <PiWaveSquare />
        <span className={styles.text}>
          {toneSquelch.dcsReversePolarity ? "RDCS" : "DCS"} {toneSquelch.dcs.toString(10).padStart(3, "0")}
        </span>
      </Pill>
    );
  }

  return <Pill>Unknown</Pill>;
}
