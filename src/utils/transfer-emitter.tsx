import events from "events";

export declare interface TransferEmitter {
    on(event: 'done', listener: (self: TransferEmitter) => void): this;
    on(event: 'update', listener: (self: TransferEmitter) => void): this;
}

export class TransferEmitter extends events.EventEmitter {
    total: number = 0;
    current: number = 0;

    setTotal(total: number) {
        this.total = total;
        this.emit('update', this);
    }

    update(value: number | ((value: number) => number)) {
        if (typeof value === 'function') {
            this.current = value(this.current);
        } else {
            this.current = value;
        }
        this.emit('update', this);
    }

    done() {
        this.current = this.total;
        this.emit('done', this);
    }
}