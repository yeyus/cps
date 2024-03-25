import * as React from "react";
import classNames from "classnames";

import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

import styles from "./select.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PASSTHROUGH_RENDERER = (value: any) => value;

interface SelectProps<T> {
  selectedValue: T;
  values: T[];
  onChange: (selectedValue: T) => void;
  buttonRenderer?: (value: T) => React.ReactNode;
  optionRenderer?: (value: T) => React.ReactNode;
  optionIdRenderer?: (value: T) => string;
  className?: string;
}

export default function Select<T>({
  selectedValue,
  values,
  onChange,
  className,
  buttonRenderer = PASSTHROUGH_RENDERER,
  optionRenderer = PASSTHROUGH_RENDERER,
  optionIdRenderer = PASSTHROUGH_RENDERER,
}: SelectProps<T>) {
  return (
    <div className={className}>
      <Listbox value={selectedValue} onChange={onChange}>
        <Listbox.Button className={classNames(styles.listboxButton)}>
          {buttonRenderer(selectedValue)}
          <FaChevronDown className={styles.buttonChevron} />
        </Listbox.Button>
        <Listbox.Options className={styles.listboxOptions}>
          {values.map((value) => (
            <Listbox.Option key={optionIdRenderer(value)} value={value}>
              {optionRenderer(value)}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
