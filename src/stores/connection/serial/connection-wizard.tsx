import * as React from "react";
import SerialConnection from "@modules/radio-types/transports/serial/serial-connection";
import { RadioDefinition } from "@configs/radio-config";
import { SerialRadio } from "@modules/radio-types/transports/serial/serial";
import { ConnectSerialRadioAction, DisconnectSerialRadioAction } from "../actions";
import { useConnection } from "../context";
import { ConnectionStatus } from "../types";
import useSerial from "./useSerial";

interface SerialPortItemProps {
  port: SerialPort;
  index: number;
  onConnect: (port: SerialPort, index: number) => void;
}

function SerialPortItem({ port, index, onConnect }: SerialPortItemProps) {
  function onConnectHandler() {
    onConnect(port, index);
  }

  return (
    <li>
      Serial Port {index}{" "}
      <button type="button" onClick={onConnectHandler}>
        Connect
      </button>
    </li>
  );
}

interface ConnectionWizardProps {
  radioDefinition: RadioDefinition<SerialRadio>;
}

export default function ConnectionWizard({ radioDefinition }: ConnectionWizardProps) {
  const { supported, ports, error, triggerPortRequest } = useSerial();
  const { dispatch, state } = useConnection();

  const onConnect = (port: SerialPort, index: number) => {
    const options: SerialOptions = radioDefinition.serialOptions ?? { baudRate: 9600 };
    const connection = new SerialConnection(index, port, options);
    const radioInstance = radioDefinition.createRadio(connection);
    ConnectSerialRadioAction(dispatch, radioInstance);
  };

  const onDisconnect = () => {
    DisconnectSerialRadioAction(dispatch, state);
  };

  const renderPortList = () => {
    if (ports.length === 0) {
      return <p>No serial ports found.</p>;
    }

    return (
      <div className="ports">
        <ul>
          {ports.map((port: SerialPort, portIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <SerialPortItem key={`serial_${portIndex}`} port={port} index={portIndex} onConnect={onConnect} />
          ))}
        </ul>
      </div>
    );
  };

  const renderError = () => (
    <p>
      Error while listing serial ports:
      <pre>{JSON.stringify(error)}</pre>
    </p>
  );

  if (!supported) {
    return <p>This browser doesn&apos;t support WebSerial API</p>;
  }

  return (
    <>
      {(error || state.error) && renderError()}
      {!error && renderPortList()}
      <button type="button" onClick={triggerPortRequest}>
        Request Ports
      </button>
      <button type="button" onClick={onDisconnect} disabled={state.status !== ConnectionStatus.CONNECTED}>
        Disconnect
      </button>
    </>
  );
}
