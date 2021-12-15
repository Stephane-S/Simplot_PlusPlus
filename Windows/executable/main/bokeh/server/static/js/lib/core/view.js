import { Signal0, Signal } from "./signaling";
import { stylesheet } from "./dom";
import { isArray } from "./util/types";
import root_css from "../styles/root.css";
export class View {
    constructor(options) {
        this.removed = new Signal0(this, "removed");
        this._ready = Promise.resolve(undefined);
        if (options.model != null)
            this.model = options.model;
        else
            throw new Error("model of a view wasn't configured");
        this._parent = options.parent;
    }
    get ready() {
        return this._ready;
    }
    connect(signal, slot) {
        const new_slot = (args, sender) => {
            const promise = Promise.resolve(slot.call(this, args, sender));
            this._ready = this._ready.then(() => promise);
        };
        return signal.connect(new_slot, this);
    }
    disconnect(signal, slot) {
        return signal.disconnect(slot, this);
    }
    initialize() {
        this._has_finished = false;
        if (this.is_root) {
            this._stylesheet = stylesheet;
        }
        for (const style of this.styles()) {
            this.stylesheet.append(style);
        }
    }
    async lazy_initialize() { }
    remove() {
        this._parent = undefined;
        this.disconnect_signals();
        this.removed.emit();
    }
    toString() {
        return `${this.model.type}View(${this.model.id})`;
    }
    serializable_state() {
        return { type: this.model.type };
    }
    get parent() {
        if (this._parent !== undefined)
            return this._parent;
        else
            throw new Error("parent of a view wasn't configured");
    }
    get is_root() {
        return this.parent === null;
    }
    get root() {
        return this.is_root ? this : this.parent.root;
    }
    assert_root() {
        if (!this.is_root)
            throw new Error(`${this.toString()} is not a root layout`);
    }
    has_finished() {
        return this._has_finished;
    }
    get is_idle() {
        return this.has_finished();
    }
    connect_signals() { }
    disconnect_signals() {
        Signal.disconnectReceiver(this);
    }
    on_change(properties, fn) {
        for (const property of isArray(properties) ? properties : [properties]) {
            this.connect(property.change, fn);
        }
    }
    cursor(_sx, _sy) {
        return null;
    }
    get stylesheet() {
        if (this.is_root)
            return this._stylesheet;
        else
            return this.root.stylesheet;
    }
    styles() {
        return [root_css];
    }
}
View.__name__ = "View";
//# sourceMappingURL=view.js.map