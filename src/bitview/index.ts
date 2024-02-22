export default class BitView {
  public static asBoolean(buffer: Uint8Array, offset: number, bitOffset: number): boolean {
    const n = buffer.at(offset);
    if (n === undefined) {
      throw new Error(`Can't parse bit value as boolean at offset ${offset}`);
    }

    return ((n >> bitOffset) & 1) > 0;
  }

  public static asNumber(buffer: Uint8Array, offset: number, bitOffset: number, bitLength: number): number {
    const n = buffer.at(offset);
    if (n === undefined) {
      throw new Error(`Can't parse bit value as number at offset ${offset}`);
    }

    let mask = 0;
    for (let i = 0; i < bitLength; i += 1) {
      mask = (mask << 1) | 1;
    }

    return (n >> bitOffset) & mask;
  }

  public static asString(buffer: Uint8Array, offset: number): string {
    const n = buffer.at(offset);
    if (n === undefined) {
      throw new Error(`Can't parse string value at offset ${offset}`);
    }

    return String.fromCharCode(n);
  }
}
