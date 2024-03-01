import * as React from "react";
import { CodeplugReadResponse } from "../radio-types/base";

export default function ExportMemoryButton({ codeplugReadResponse }: { codeplugReadResponse: CodeplugReadResponse }) {
  const downloadUrl = React.useMemo(() => {
    const blob = new Blob([codeplugReadResponse.memory], { type: "application/octet-stream" });
    return URL.createObjectURL(blob);
  }, [codeplugReadResponse]);

  return (
    <button type="button" disabled={codeplugReadResponse == null}>
      <a download="codeplug.bin" target="_blank" rel="noreferrer" href={downloadUrl}>
        Save Codeplug
      </a>
    </button>
  );
}
