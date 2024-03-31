import * as React from "react";
import classNames from "classnames";
import NiceModal from "@ebay/nice-modal-react";

import { ConnectionProvider } from "@stores/connection/context";
import { CodeplugProvider } from "@stores/codeplug/context";
import { useTheme } from "@stores/theme";
import { useRadio } from "@stores/radio";

import RadioPicker from "@modules/radio-picker/radio-picker";
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
  const { radio: radioDefinition } = useRadio();

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
        <NiceModal.Provider>
          <div className={classNames(styles.App, { "theme-light": theme === "light", "theme-dark": theme === "dark" })}>
            <Header className={styles.header} />
            <div className={styles.content}>
              {radioDefinition == null && (
                <section>
                  <h2>Select your radio</h2>
                  <RadioPicker />
                </section>
              )}
              {radioDefinition != null && (
                <section className={styles.tableContainer}>
                  <ChannelGridWrapper radioDefinition={radioDefinition} />
                </section>
              )}
            </div>
          </div>
        </NiceModal.Provider>
      </CodeplugProvider>
    </ConnectionProvider>
  );
}

export default App;
