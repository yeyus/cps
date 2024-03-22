import * as React from "react";

import { ChannelSlot } from "@/proto/gen/cps/model/v1/channel_pb";
import { CellContext } from "@tanstack/react-table";

export default function CheckboxCell(props: CellContext<ChannelSlot, boolean | undefined>) {
  // eslint-disable-next-line react/destructuring-assignment
  const value = props.getValue();
  if (value === undefined) return null;

  return <input type="checkbox" checked={value} />;
}
