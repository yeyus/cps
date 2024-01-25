import events from "events";

export declare interface TransferEmitterInterface {
  total: number;
  current: number;

  on(event: "done", listener: (self: TransferEmitterInterface) => void): this;
  on(event: "update", listener: (self: TransferEmitterInterface) => void): this;

  setTotal(total: number): void;
  update(value: number | ((value: number) => number)): void;
  done(): void;
}

export class TransferEmitter extends events.EventEmitter implements TransferEmitterInterface {
  total: number = 0;

  current: number = 0;

  setTotal(total: number) {
    this.total = total;
    this.emit("update", this);
  }

  update(value: number | ((value: number) => number)) {
    if (typeof value === "function") {
      this.current = value(this.current);
    } else {
      this.current = value;
    }
    this.emit("update", this);
  }

  done() {
    this.current = this.total;
    this.emit("done", this);
  }
}
