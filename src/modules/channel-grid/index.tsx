import * as React from "react";
import { RadioDefinition } from "@/configs/radio-config";
import { useCodeplug } from "../../stores/codeplug/context";
import ChannelGridTable from "./table";
import { RadioTransports } from "../radio-types/transports";

import styles from "./table.module.css";

export default function ChannelGridWrapper({ radioDefinition }: { radioDefinition: RadioDefinition<RadioTransports> }) {
  const { state } = useCodeplug();

  return (
    <div className={styles.tableWrapper}>
      <ChannelGridTable
        channelSlots={state.codeplug?.channelSlots || []}
        extraColumns={radioDefinition.getExtraColumns()}
      />
    </div>
  );
}
