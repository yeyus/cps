import * as React from "react";
import { ConnectionProvider } from "./modules/connection-manager/context";
import "./App.css";
import ConnectionWizard from "./modules/connection-manager/serial/connection-wizard";
import RadioPicker from "./modules/radio-picker/radio-picker";
import { RadioDefinition } from "./configs/radio-config";
import { Transport } from "./modules/connection-manager/types";
import RadioDownloader from "./modules/radio-downloader/radio-downloader";
import { RadioTransports } from "./modules/radio-types/transports";
import { CodeplugProvider } from "./modules/codeplug-manager/context";
import CodeplugFileImport from "./modules/codeplug-file-import";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DebugCPS: any;
  }
}

window.DebugCPS = window.DebugCPS || {};

function App() {
  const [radioDefinition, setRadioDefinition] = React.useState<RadioDefinition<RadioTransports>>();
  const handleRadioSelect = (selected: RadioDefinition<RadioTransports>) => setRadioDefinition(selected);

  return (
    <ConnectionProvider>
      <CodeplugProvider>
        <div className="App">
          {radioDefinition == null && (
            <section>
              <h2>Select your radio</h2>
              <RadioPicker selected={radioDefinition} onSelect={handleRadioSelect} />
            </section>
          )}
          {radioDefinition != null && (
            <section>
              <h2>Import your codeplug</h2>

              <div>
                <h3>From your radio</h3>
                {radioDefinition && radioDefinition.transport === Transport.SERIAL && (
                  <ConnectionWizard radioDefinition={radioDefinition} />
                )}
                <RadioDownloader radioDefinition={radioDefinition} />
              </div>

              <h3>or</h3>

              <div>
                <h3>From a raw memory dump</h3>
                <CodeplugFileImport radioDefinition={radioDefinition} />
              </div>
            </section>
          )}
        </div>
      </CodeplugProvider>
    </ConnectionProvider>
  );
}

export default App;
