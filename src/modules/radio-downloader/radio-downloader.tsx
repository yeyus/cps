import * as React from "react";
import { TransferEmitter } from "../../utils/transfer-emitter";
import { useConnection } from "../connection-manager/context";
import { ConnectionStatus } from "../connection-manager/types";
import { QuanshengUVK5MemoryMap } from "../../configs/radios/quansheng/uvk5/memory-map";
import { CodeplugReadResponse } from "../radio-types/base";

function SaveToDiskButton({ codeplug }: { codeplug: CodeplugReadResponse }) {
  const downloadUrl = React.useMemo(() => {
    const blob = new Blob([codeplug.memory], { type: "application/octet-stream" });
    return URL.createObjectURL(blob);
  }, [codeplug]);

  return (
    <button type="button" disabled={codeplug == null}>
      <a download="codeplug.bin" target="_blank" rel="noreferrer" href={downloadUrl}>
        Save Codeplug
      </a>
    </button>
  );
}

export default function RadioDownloader() {
  const [total, setTotal] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const emitterRef = React.useRef<TransferEmitter | undefined>(undefined);
  const { state: connection } = useConnection();
  const isConnected = connection.status === ConnectionStatus.CONNECTED && connection.radio !== null;

  const [codeplug, setCodeplug] = React.useState<CodeplugReadResponse>();

  React.useEffect(() => {
    // debug
    window.DebugCPS = { ...window.DebugCPS, radio: connection.radio };

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
    const bytes = await connection.radio?.downloadCodeplug(emitterRef.current);
    setCodeplug(bytes);
  };

  const handleDecode = () => {
    if (codeplug === undefined) return;

    const memoryMap = QuanshengUVK5MemoryMap.fromBuffer(codeplug.memory);
    console.log(`The memory map`, memoryMap);
  };

  return (
    <>
      <button type="button" onClick={handleDownload} disabled={!isConnected}>
        Download Codeplug
      </button>
      <button type="button" onClick={handleDecode} disabled={codeplug === undefined}>
        Decode Codeplug
      </button>
      <span>
        {current}/{total}
      </span>
      {codeplug != null ? <SaveToDiskButton codeplug={codeplug} /> : null}
    </>
  );
}
