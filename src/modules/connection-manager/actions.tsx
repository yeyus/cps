import { SerialRadio } from "../../configs/radio-config";
import { ConnectionAction, ConnectionState, ConnectionStatus, Transport } from "./types";

export const ConnectSerialRadioAction = (dispatch: React.Dispatch<ConnectionAction>, radio: SerialRadio) : void => {
    // try to open serial port
    const {connection} = radio;
    console.log(`Opening serial port #${connection.index}...`);    

    connection.on('open', (connection) => dispatch({ type: 'CONNECTION_OPEN', radio }));
    connection.on('disconnect', () => dispatch({ type: 'CONNECTION_CLOSE' }));
    connection.on('error', (error) => dispatch({ type: 'CONNECTION_ERROR', error }));

    connection.open()
};

export const DisconnectSerialRadioAction = (dispatch: React.Dispatch<ConnectionAction>, state: ConnectionState) : void => {
    if (state.status === ConnectionStatus.DISCONNECTED || state.radio === null || state.radio.transport !== Transport.SERIAL) return;

    const serialRadio = state.radio as SerialRadio;
    const connection = serialRadio.connection;
    console.log(`Closing serial port ${connection.index}...`);

    connection.close().then(() => {
        dispatch({ type: 'CONNECTION_CLOSE' });
    });
}