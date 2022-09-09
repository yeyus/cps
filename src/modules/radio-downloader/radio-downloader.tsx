import * as React from 'react';
import { TransferEmitter } from '../../utils/transfer-emitter';
import { useConnection } from '../connection-manager/context';
import { ConnectionStatus } from '../connection-manager/types';

export function RadioDownloader() {
    const [total, setTotal] = React.useState(0);
    const [current, setCurrent] = React.useState(0);
    const emitterRef = React.useRef<TransferEmitter|undefined>(undefined);
    const {state: connection} = useConnection();
    const isConnected = connection.status === ConnectionStatus.CONNECTED && connection.radio !== null;

    React.useEffect(() => {
        emitterRef.current = new TransferEmitter();
        
        return () => {
            emitterRef.current = undefined;
        };
    }, []);
    
    emitterRef.current?.on('update', (emitter) => {
        setTotal(emitter.total);
        setCurrent(emitter.current);
    });

    const handleDownload = () => {
        connection.radio?.downloadCodeplug(emitterRef.current)
    }

    return (
        <>
            <button onClick={handleDownload} disabled={!isConnected}>Download Codeplug</button>
            <span>{current}/{total}</span>
        </>
    );
}