import { BaseRadioInterface, Transport } from "@modules/radio-types/base";

export type ConnectionAction =
  | { type: "CONNECTION_OPEN"; radio: BaseRadioInterface }
  // TODO: define error typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "CONNECTION_ERROR"; error: any }
  | { type: "CONNECTION_CLOSE" };

export type ConnectionDispatch = (action: ConnectionAction) => void;
export type ConnectionProviderProps = { children: React.ReactNode };

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTED = "connected",
  TRANSFERRING = "transferring",
}

export interface ConnectionState {
  status: ConnectionStatus;
  radio: BaseRadioInterface | null;
  // TODO: define error typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

interface BaseConnection {
  type: Transport;
}

export interface HIDConnectionInterface extends BaseConnection {}

export interface USBConnectionInterface extends BaseConnection {}

export interface SerialConnectionInterface extends BaseConnection {
  index: number;
  port: SerialPort;
  options: SerialOptions;

  write(data: Uint8Array): Promise<void>;
  read(): Promise<Uint8Array>;
}

export type Connection = SerialConnectionInterface | HIDConnectionInterface | USBConnectionInterface;

export { Transport };
