/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import hexdump from "@buzuli/hexdump";

export interface Logger {
  debug(...data: any[]): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  hex(data: Uint8Array): void;
}

export default function getLogger(tag: string): Logger {
  const bypass = (...args: any[]) => console.log(`[${tag}]`, ...args);

  return {
    debug: bypass,
    info: bypass,
    log: bypass,
    warn: bypass,
    error: bypass,
    hex: (data: Uint8Array) => {
      console.group(`[${tag}] hex dump`);
      console.debug(hexdump(data));
      console.groupEnd();
    },
  };
}
