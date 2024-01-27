import * as React from "react";
import { ConnectionProvider } from "./modules/connection-manager/context";
import "./App.css";
import ConnectionWizard from "./modules/connection-manager/serial/connection-wizard";
import RadioPicker from "./modules/radio-picker/radio-picker";
import { RadioDefinition } from "./configs/radio-config";
import { Transport } from "./modules/connection-manager/types";
import RadioDownloader from "./modules/radio-downloader/radio-downloader";
import { RadioTransports } from "./modules/radio-types/transports";
import ConnectionStatusComponent from "./modules/connection-manager/connection-status";

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
      <div className="App">
        <ConnectionStatusComponent />
        <section>
          <RadioPicker selected={radio} onSelect={handleRadioSelect} />
          {radio && radio.transport === Transport.SERIAL && <ConnectionWizard radioDefinition={radio} />}
          <RadioDownloader />
        </section>
      </div>
    </ConnectionProvider>
  );
}

export default App;
