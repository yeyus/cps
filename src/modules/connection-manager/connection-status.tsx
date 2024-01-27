import * as React from "react";
import classNames from "classnames";
import { useConnection } from "./context";
import SerialPortOutlineIcon from "../../icons/serial-port-outline";
import SerialPortFilledIcon from "../../icons/serial-port-filled";
import { ConnectionStatus } from "./types";
import styles from "./connection-status.module.css";
import AlertTriangleIcon from "../../icons/alert-triangle";
import { disconnectSerialRadioAction } from "./actions";

function ConnectionIcon({ state, className }: { state: ConnectionStatus; className: string }) {
  switch (state) {
    case ConnectionStatus.CONNECTED:
      return <SerialPortFilledIcon className={classNames(styles.connected, className)} />;
    case ConnectionStatus.DISCONNECTED:
      return <SerialPortOutlineIcon className={classNames(styles.disconnected, className)} />;
    case ConnectionStatus.TRANSFERRING:
      return <SerialPortFilledIcon className={classNames(styles.connected, styles.rumble, className)} />;
    default:
      return <SerialPortOutlineIcon />;
  }
}

export default function ConnectionStatusComponent() {
  const { dispatch, state } = useConnection();

  const handleDisconnect = () => disconnectSerialRadioAction(dispatch, state);

  return (
    <div className={styles.wrapper}>
      <ConnectionIcon state={state.status} className={styles.portIcon} />
      {state.status === ConnectionStatus.CONNECTED || state.status === ConnectionStatus.TRANSFERRING
        ? state.radio?.name
        : "Not connected"}
      {state.error != null ? <AlertTriangleIcon className={classNames(styles.alertIcon, styles.alert)} /> : null}
      {state.status === ConnectionStatus.CONNECTED || state.status === ConnectionStatus.TRANSFERRING ? (
        <button type="button" className={styles.disconnectButton} onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : null}
    </div>
  );
}
