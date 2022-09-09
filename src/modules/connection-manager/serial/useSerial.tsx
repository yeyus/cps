import * as React from "react";

function isWebSerialSupported() {
    return 'serial' in navigator
}

async function listPorts() {
    return navigator.serial.getPorts();
}

export function useSerial() {
    const [requested, setRequested] = React.useState<boolean>(false);
    const [ports, setPorts] = React.useState<SerialPort[]>([]);
    const [error, setError] = React.useState<DOMException|null>(null);
    const supported = isWebSerialSupported();

    const triggerPortRequest = async () => {
        try {
            await navigator.serial.requestPort();
            setRequested(true);
        } catch (e) {
            console.error('Error while requesting ports', e);
            setError(e as DOMException);
        }        
    };

    React.useEffect(() => {
        try {
            listPorts().then((ports : SerialPort[]) => {
                setPorts(ports);
            });
        } catch (e) {
            setError(e as DOMException);
        }
    }, [requested]);

    return {supported, error, ports, triggerPortRequest}
}