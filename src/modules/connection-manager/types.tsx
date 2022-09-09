import { BaseRadio } from "../../configs/radio-config";

export type ConnectionAction = 
    {type: 'CONNECTION_OPEN', radio: BaseRadio} | 
    {type: 'CONNECTION_ERROR', error: any} | 
    {type: 'CONNECTION_CLOSE'};

export type ConnectionDispatch = (action: ConnectionAction) => void;
export type ConnectionProviderProps = {children: React.ReactNode};

export enum ConnectionStatus {
    DISCONNECTED = 'disconnected',
    CONNECTED = 'connected',
    TRANSFERRING = 'transferring'
}

export interface ConnectionState {
    status: ConnectionStatus;
    radio: BaseRadio | null;
    error?: any;
}

export enum Transport {
    USB_CUSTOM = 'usb-custom',
    USB_HID = 'usb-hid',
    SERIAL = 'serial'
}

export type Connection = 
    SerialConnectionInterface | 
    HIDConnectionInterface | 
    USBConnectionInterface;

interface BaseConnection {
    type: Transport;
}

export interface HIDConnectionInterface extends BaseConnection {};

export interface USBConnectionInterface extends BaseConnection {};

export interface SerialConnectionInterface extends BaseConnection {
    index: number;
    port: SerialPort;
    options: SerialOptions;

    write(data: Uint8Array) : Promise<void>;
    read() : Promise<Uint8Array>;
}