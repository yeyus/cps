import * as React from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { useFloating } from "@floating-ui/react";
import { FaDev } from "react-icons/fa";

import styles from "./app-version.module.css";

export type AppEnvironment = "development" | "staging" | "production";

export function useAppVersion() {
  const [environment, setEnvironment] = React.useState<AppEnvironment>();
  const [hash, setHash] = React.useState<string>();

  React.useEffect(() => {
    const metas = document.getElementsByTagName("meta");

    for (let i = 0; i < metas.length; i += 1) {
      if (metas[i].name === "environment") {
        setEnvironment(metas[i].content as AppEnvironment);
      } else if (metas[i].name === "build-version") {
        setHash(metas[i].content);
      }
    }
  }, []);

  return { environment, hash };
}

export default function AppVersion({ className }: { className?: string }) {
  const { environment, hash } = useAppVersion();
  const { refs, floatingStyles } = useFloating({ placement: "bottom-end" });

  return (
    <Popover>
      <Popover.Button
        ref={refs.setReference}
        aria-label="Development menu"
        className={classNames(className, styles.button)}
      >
        <FaDev size={26} />
      </Popover.Button>

      <Popover.Panel ref={refs.setFloating} style={floatingStyles} className={styles.popover}>
        <h1>
          Environment: <code>{environment}</code>
        </h1>
        <h2>
          Version: <code>{hash?.substring(0, 7)}</code>
        </h2>
        <p>Built with ❤️ by @yeyus (🇺🇸KF6J 🇪🇸EA7JMF)</p>
      </Popover.Panel>
    </Popover>
  );
}
