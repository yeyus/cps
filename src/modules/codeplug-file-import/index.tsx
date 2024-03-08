import * as React from "react";
import * as ReactDOM from "react-dom";

import { RadioDefinition } from "@configs/radio-config";
import { loadCodeplugAction } from "@stores/codeplug/actions";
import { useCodeplug } from "@stores/codeplug/context";

import { RadioTransports } from "../radio-types/transports";
import { CodeplugReadResponse } from "../radio-types/base";

interface FormState {
  error?: string;
  fileSize?: number;
  name?: string;
  success?: boolean;
  stats?: {
    brand?: string;
    model?: string;
    serialNumber?: string;
    channels: number;
  };
}

export default function CodeplugFileImport({ radioDefinition }: { radioDefinition: RadioDefinition<RadioTransports> }) {
  const [isFileSelected, setFileSelected] = React.useState(false);
  const { dispatch } = useCodeplug();

  async function parseFile(_prevState: FormState, formData: FormData): Promise<FormState> {
    const file: File = formData.get("file") as File;
    const buffer = await file.arrayBuffer();

    const readResponse = new CodeplugReadResponse(new Uint8Array(buffer), new Date(file.lastModified));
    const codeplug = radioDefinition.deserializeCodeplug(readResponse);

    if (codeplug == null)
      return { error: `Could not parse codeplug from ${file.name}`, fileSize: file.size, name: file.name };

    loadCodeplugAction(dispatch, codeplug);

    return {
      success: true,
      fileSize: file.size,
      name: file.name,
      stats: {
        brand: codeplug.radio?.brand,
        model: codeplug.radio?.model,
        serialNumber: codeplug.radio?.serialNumber,
        channels: codeplug.channelSlots.length,
      },
    };
  }

  const [formState, formAction] = ReactDOM.useFormState(parseFile, {});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(event.target.value != null);
  };

  return (
    <form action={formAction}>
      <input type="file" name="file" accept=".bin,application/octet-stream" onChange={handleFileChange} />
      <button type="submit" disabled={!isFileSelected}>
        Import RAW Codeplug
      </button>
      {formState?.error != null && <div className="error">{formState.error}</div>}
      {formState?.success != null && (
        <div className="success">
          Success! Imported {formState.fileSize} bytes and {formState.stats?.channels} channels
        </div>
      )}
    </form>
  );
}
