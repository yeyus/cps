/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export interface Logger {
  debug(...data: any[]): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  hex(data: Uint8Array): void;
}

function hexdump(buffer: Uint8Array): string {
  let hex: string[] = [];
  let ascii: string[] = [];
  let total: number = 0;
  let offset: number = 0;
  const parts: string[] = [];

  const extend = () => {
    // eslint-disable-next-line prefer-template
    const prefix = total.toString(16).padStart(8, "0");
    const diff = 16 - offset;
    const pad = " ".repeat(diff * 2 + diff / 2);
    parts.push(`${prefix}: ${hex.join("")} ${pad} ${ascii.join("")}`);

    total += offset;
    offset = 0;
    hex = [];
    ascii = [];
  };

  for (let i = 0; i < buffer.length; i += 1) {
    const b = buffer[i];
    if (offset > 0 && offset % 2 === 0) {
      hex.push(" ");
    }
    hex.push((b & 0xff).toString(16).padStart(2, "0"));
    ascii.push(b > 31 && b < 128 ? String.fromCharCode(b) : ".");

    offset += 1;

    if (offset === 16) {
      extend();
    }
  }

  if (offset > 0) {
    extend();
  }

  return parts.join("\n");
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
