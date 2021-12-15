import { HasProps } from "./core/has_props";
import * as p from "./core/properties";
import { isString } from "./core/util/types";
import { isEmpty, entries } from "./core/util/object";
import { logger } from "./core/logging";
export class Model extends HasProps {
    constructor(attrs) {
        super(attrs);
    }
    static init_Model() {
        this.define({
            tags: [p.Array, []],
            name: [p.String],
            js_property_callbacks: [p.Any, {}],
            js_event_callbacks: [p.Any, {}],
            subscribed_events: [p.Array, []],
        });
    }
    initialize() {
        super.initialize();
        this._js_callbacks = new Map();
    }
    connect_signals() {
        super.connect_signals();
        this._update_property_callbacks();
        this.connect(this.properties.js_property_callbacks.change, () => this._update_property_callbacks());
        this.connect(this.properties.js_event_callbacks.change, () => this._update_event_callbacks());
        this.connect(this.properties.subscribed_events.change, () => this._update_event_callbacks());
    }
    /*protected*/ _process_event(event) {
        for (const callback of this.js_event_callbacks[event.event_name] || [])
            callback.execute(event);
        if (this.document != null && this.subscribed_events.some((m) => m == event.event_name))
            this.document.event_manager.send_event(event);
    }
    trigger_event(event) {
        if (this.document != null) {
            event.origin = this;
            this.document.event_manager.trigger(event);
        }
    }
    _update_event_callbacks() {
        if (this.document == null) {
            // File an issue: SidePanel in particular seems to have this issue
            logger.warn('WARNING: Document not defined for updating event callbacks');
            return;
        }
        this.document.event_manager.subscribed_models.add(this);
    }
    _update_property_callbacks() {
        const signal_for = (event) => {
            const [evt, attr = null] = event.split(":");
            return attr != null ? this.properties[attr][evt] : this[evt];
        };
        for (const [event, callbacks] of this._js_callbacks) {
            const signal = signal_for(event);
            for (const cb of callbacks)
                this.disconnect(signal, cb);
        }
        this._js_callbacks.clear();
        for (const [event, callbacks] of entries(this.js_property_callbacks)) {
            const wrappers = callbacks.map((cb) => () => cb.execute(this));
            this._js_callbacks.set(event, wrappers);
            const signal = signal_for(event);
            for (const cb of wrappers)
                this.connect(signal, cb);
        }
    }
    _doc_attached() {
        if (!isEmpty(this.js_event_callbacks) || this.subscribed_events.length != 0)
            this._update_event_callbacks();
    }
    _doc_detached() {
        this.document.event_manager.subscribed_models.delete(this);
    }
    select(selector) {
        if (isString(selector))
            return [...this.references()].filter((ref) => ref instanceof Model && ref.name === selector);
        else if (selector.prototype instanceof HasProps)
            return [...this.references()].filter((ref) => ref instanceof selector);
        else
            throw new Error("invalid selector");
    }
    select_one(selector) {
        const result = this.select(selector);
        switch (result.length) {
            case 0:
                return null;
            case 1:
                return result[0];
            default:
                throw new Error("found more than one object matching given selector");
        }
    }
}
Model.__name__ = "Model";
Model.init_Model();
//# sourceMappingURL=model.js.map