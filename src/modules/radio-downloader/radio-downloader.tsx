import * as React from "react";
import { TransferEmitter } from "../../utils/transfer-emitter";
import { useConnection } from "../connection-manager/context";
import { ConnectionStatus } from "../connection-manager/types";
import { CodeplugReadResponse } from "../radio-types/base";
import { useCodeplug } from "../codeplug-manager/context";
import { loadCodeplugAction } from "../codeplug-manager/actions";
import ExportMemoryButton from "./export-memory-button";
import { RadioDefinition } from "../../configs/radio-config";
import { RadioTransports } from "../radio-types/transports";

export default function RadioDownloader({ radioDefinition }: { radioDefinition: RadioDefinition<RadioTransports> }) {
  const [total, setTotal] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [codeplugReadResponse, setCodeplugReadResponse] = React.useState<CodeplugReadResponse>();
  const emitterRef = React.useRef<TransferEmitter | undefined>(undefined);
  const { state: connectionStore } = useConnection();
  const { dispatch } = useCodeplug();
  const isConnected = connectionStore.status === ConnectionStatus.CONNECTED && connectionStore.radio !== null;

  React.useEffect(() => {
    // debug
    window.DebugCPS = { ...window.DebugCPS, radio: connectionStore.radio };

    emitterRef.current = new TransferEmitter();

    return () => {
      emitterRef.current = undefined;
    };
  }, []);

  emitterRef.current?.on("update", (emitter) => {
    setTotal(emitter.total);
    setCurrent(emitter.current);
  });

  const handleDownload = async () => {
    const readResponse = await connectionStore.radio?.downloadCodeplug(emitterRef.current);
    setCodeplugReadResponse(readResponse);
    if (readResponse == null) return;

    const codeplug = radioDefinition.deserializeCodeplug(readResponse);
    if (codeplug == null) return;
    loadCodeplugAction(dispatch, codeplug);
  };

  return (
    <>
      <button type="button" onClick={handleDownload} disabled={!isConnected}>
        Download Codeplug
      </button>
      <span>
        {current}/{total}
      </span>
      {codeplugReadResponse != null ? <ExportMemoryButton codeplugReadResponse={codeplugReadResponse} /> : null}
    </>
  );
}
