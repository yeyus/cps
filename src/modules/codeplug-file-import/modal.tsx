import * as React from "react";
import { Dialog } from "@headlessui/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

import ConnectionWizard from "@stores/connection/serial/connection-wizard";
import { useRadio } from "@stores/radio";
import RadioDownloader from "@modules/radio-downloader/radio-downloader";
import CodeplugFileImport from ".";
import { Transport } from "../radio-types/base";

import styles from "./modal.module.css";

interface ModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ visible, title, description, onClose, children }: ModalProps) {
  return (
    <Dialog open={visible} onClose={onClose}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.panelFixed}>
        <div className={styles.panelContainer}>
          <Dialog.Panel className={styles.panel}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>

            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

export default NiceModal.create(() => {
  const { visible, hide } = useModal();
  const { radio } = useRadio();

  if (radio == null) return null;

  return (
    <Modal
      visible={visible}
      title="Import codeplug"
      description="Download from radio or import file."
      onClose={() => hide()}
    >
      <section>
        <h2>Import your codeplug</h2>

        <div>
          <h3>From your radio</h3>
          {radio?.transport === Transport.SERIAL && <ConnectionWizard radioDefinition={radio} />}
          <RadioDownloader radioDefinition={radio} />
        </div>

        <h3>or</h3>

        <div>
          <h3>From a raw memory dump</h3>
          <CodeplugFileImport radioDefinition={radio} />
        </div>
      </section>
    </Modal>
  );
});
