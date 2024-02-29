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
  const [radio, setRadio] = React.useState<RadioDefinition<RadioTransports>>();
  const handleRadioSelect = (selected: RadioDefinition<RadioTransports>) => setRadio(selected);

  return (
    <ConnectionProvider>
      <CodeplugProvider>
        <div className="App">
          {radio == null && (
            <section>
              <h2>Select your radio</h2>
              <RadioPicker selected={radio} onSelect={handleRadioSelect} />
            </section>
          )}
          {radio != null && (
            <section>
              <h2>Import your codeplug</h2>

              <div>
                <h3>From your radio</h3>
                {radio && radio.transport === Transport.SERIAL && <ConnectionWizard radioDefinition={radio} />}
                <RadioDownloader />
              </div>

              <h3>or</h3>

              <div>
                <h3>From a raw memory dump</h3>
                <CodeplugFileImport />
              </div>
            </section>
          )}
        </div>
      </CodeplugProvider>
    </ConnectionProvider>
  );
}

export default App;
