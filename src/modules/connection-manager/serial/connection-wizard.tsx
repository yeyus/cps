import { NONAME } from 'dns';
import * as React from 'react';
import { RadioDefinition } from '../../../configs/radio-config';
import { ConnectSerialRadioAction, DisconnectSerialRadioAction } from '../actions';
import { useConnection } from '../context';
import { ConnectionStatus } from '../types';
import { SerialConnection } from './serial-connection';
import { useSerial } from './useSerial';

interface SerialPortItemProps {
    port: SerialPort;
    index: number;
    onConnect: (port: SerialPort, index: number) => void;
}

function SerialPortItem({ port, index, onConnect } : SerialPortItemProps) {
    function onConnectHandler() {
        onConnect(port, index);
    }

    return (
        <li>Serial Port {index} <button onClick={onConnectHandler}>Connect</button></li>
    );
}

interface ConnectionWizardProps {
    radio: RadioDefinition;
}

export function ConnectionWizard({radio} : ConnectionWizardProps) {
    const { supported, ports, error, triggerPortRequest } = useSerial();
    const { dispatch, state } = useConnection();

    const onConnect = (port: SerialPort, index: number) => {
        const options : SerialOptions = radio.serialOptions ?? { baudRate: 9600 };
        const connection = new SerialConnection(index, port, options);
        const radioInstance = new radio.factory(connection);
        ConnectSerialRadioAction(dispatch, radioInstance);
    }
    
    const onDisconnect = () => {
        DisconnectSerialRadioAction(dispatch, state);
    }

    const renderPortList = () => {
        if (ports.length === 0) {
            return <p>No serial ports found.</p>
        }

        return (
            <div className="ports">
                <ul>
                    { ports.map((port: SerialPort, portIndex) => <SerialPortItem key={portIndex} port={port} index={portIndex} onConnect={onConnect}/>) }
                </ul>
            </div>
        );
    }

    const renderError = () => {
        return (
            <p>
                Error while listing serial ports:
                <pre>{JSON.stringify(error)}</pre>
            </p>);
    }

    return (
        <>
            {!supported && <p>This browser does't support WebSerial API</p>}
            {(error || state.error) && renderError()}
            {supported && !error && renderPortList()}
            <button onClick={triggerPortRequest}>Request Ports</button>
            <button onClick={onDisconnect} disabled={state.status !== ConnectionStatus.CONNECTED}>Disconnect</button>
        </>
    )
}