import * as React from "react";
import classNames from "classnames";

import { ConnectionProvider } from "@stores/connection/context";
import ConnectionWizard from "@stores/connection/serial/connection-wizard";
import { CodeplugProvider } from "@stores/codeplug/context";
import { useTheme } from "@stores/theme";
import { Transport } from "@stores/connection/types";

import RadioPicker from "@modules/radio-picker/radio-picker";
import { RadioDefinition } from "@configs/radio-config";
import RadioDownloader from "@modules/radio-downloader/radio-downloader";
import { RadioTransports } from "@modules/radio-types/transports";
import CodeplugFileImport from "@modules/codeplug-file-import";
import ChannelGridWrapper from "@modules/channel-grid";
import Header from "@modules/header";

import "./styles/accessibility.css";
import "./styles/zindex.css";
import "./styles/colors.css";

import styles from "./App.module.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DebugCPS: any;
  }
}

window.DebugCPS = window.DebugCPS || {};

function App() {
  const theme = useTheme();
  const [radioDefinition, setRadioDefinition] = React.useState<RadioDefinition<RadioTransports>>();
  const handleRadioSelect = (selected: RadioDefinition<RadioTransports>) => setRadioDefinition(selected);

  React.useEffect(() => {
    document.body.classList.add(styles.body);
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

    return () => {
      document.body.classList.remove(styles.body);
      document.body.classList.remove(theme === "light" ? "theme-light" : "theme-dark");
    };
  }, [theme]);

  return (
    <ConnectionProvider>
      <CodeplugProvider>
        <div className={classNames(styles.App, { "theme-light": theme === "light", "theme-dark": theme === "dark" })}>
          <Header className={styles.header} />
          <div className={styles.content}>
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
            {radioDefinition != null && (
              <section className={styles.tableContainer}>
                <ChannelGridWrapper radioDefinition={radioDefinition} />
              </section>
            )}
          </div>
        </div>
      </CodeplugProvider>
    </ConnectionProvider>
  );
}

export default App;
