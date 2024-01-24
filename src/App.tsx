import * as React from "react";
import { ConnectionProvider } from "./modules/connection-manager/context";
import "./App.css";
import { ConnectionWizard } from "./modules/connection-manager/serial/connection-wizard";
import { RadioPicker } from "./modules/radio-picker/radio-picker";
import { RadioDefinition } from "./configs/radio-config";
import { Transport } from "./modules/connection-manager/types";
import { RadioDownloader } from "./modules/radio-downloader/radio-downloader";

declare global {
  interface Window {
    DebugCPS: any;
  }
}

window.DebugCPS = window.DebugCPS || {};

function App() {
  const [radio, setRadio] = React.useState<RadioDefinition>();
  const handleRadioSelect = (selected: RadioDefinition) => setRadio(selected);

  return (
    <ConnectionProvider>
      <div className="App">
        <section>
          <RadioPicker selected={radio} onSelect={handleRadioSelect} />
          {radio && radio.transport === Transport.SERIAL && <ConnectionWizard radio={radio} />}
          <RadioDownloader />
        </section>
      </div>
    </ConnectionProvider>
  );
}

export default App;
