import * as React from "react";
import { useCodeplug } from "../codeplug-manager/context";
import ChannelGridTable from "./table";

export default function ChannelGridWrapper() {
  const { state } = useCodeplug();

  return <ChannelGridTable channelSlots={state.codeplug?.channelSlots || []} />;
}
