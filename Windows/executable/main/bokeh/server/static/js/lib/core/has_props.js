import { Signal0, Signal, Signalable } from "./signaling";
import { is_ref } from "./util/refs";
import * as p from "./properties";
import * as k from "./kinds";
import * as mixins from "./property_mixins";
import { uniqueId } from "./util/string";
import { max, copy } from "./util/array";
import { values, entries, clone, extend } from "./util/object";
import { isPlainObject, isObject, isArray, isTypedArray, isString, isFunction } from "./util/types";
import { isEqual } from './util/eq';
import { DocumentEventBatch, ModelChangedEvent } from "../document";
import { is_NDArray } from "./util/ndarray";
import { encode_NDArray } from "./util/serialization";
import { equals } from "./util/eq";
import { pretty } from "./util/pretty";
import * as kinds from "./kinds";
export class HasProps extends Signalable() {
    constructor(attrs = {}) {
        var _a;
        super();
        this._subtype = undefined;
        this.document = null;
        this.destroyed = new Signal0(this, "destroyed");
        this.change = new Signal0(this, "change");
        this.transformchange = new Signal0(this, "transformchange");
        this.properties = {}; // Object.create(null)
        this._pending = false;
        this._changing = false;
        const get = attrs instanceof Map ? attrs.get : (name) => attrs[name];
        for (const [name, { type, default_value, options }] of entries(this._props)) {
            let property;
            if (type instanceof k.Kind)
                property = new p.PrimitiveProperty(this, name, type, default_value, get(name), options);
            else
                property = new type(this, name, k.Any, default_value, get(name), options);
            this.properties[name] = property;
        }
        // allowing us to defer initialization when loading many models
        // when loading a bunch of models, we want to do initialization as a second pass
        // because other objects that this one depends on might not be loaded yet
        if (!((_a = get("__deferred__")) !== null && _a !== void 0 ? _a : false)) {
            this.finalize();
            this.connect_signals();
        }
    }
    // XXX: setter is only required for backwards compatibility
    set type(name) {
        console.warn("prototype.type = 'ModelName' is deprecated, use static __name__ instead");
        this.constructor.__name__ = name;
    }
    get type() {
        return this.constructor.__qualified__;
    }
    static get __qualified__() {
        const { __module__, __name__ } = this;
        return __module__ != null ? `${__module__}.${__name__}` : __name__;
    }
    static get [Symbol.toStringTag]() {
        return this.__name__;
    }
    static init_HasProps() {
        this.prototype._props = {};
        this.prototype._mixins = [];
        this.define({
            id: [p.String, () => uniqueId()],
        });
    }
    static _fix_default(default_value, _attr) {
        if (default_value === undefined)
            return undefined;
        else if (isFunction(default_value))
            return default_value;
        else if (isArray(default_value))
            return () => copy(default_value);
        else if (isPlainObject(default_value))
            return () => clone(default_value);
        else if (!isObject(default_value))
            return () => default_value;
        else
            throw new Error(`${default_value} must be explicitly wrapped in a function`);
    }
    // TODO: don't use Partial<>, but exclude inherited properties
    static define(obj) {
        for (const [name, prop] of entries(isFunction(obj) ? obj(kinds) : obj)) {
            if (this.prototype._props[name] != null)
                throw new Error(`attempted to redefine property '${this.prototype.type}.${name}'`);
            if (this.prototype[name] != null)
                throw new Error(`attempted to redefine attribute '${this.prototype.type}.${name}'`);
            Object.defineProperty(this.prototype, name, {
                // XXX: don't use tail calls in getters/setters due to https://bugs.webkit.org/show_bug.cgi?id=164306
                get() {
                    const value = this.properties[name].get_value();
                    return value;
                },
                set(value) {
                    this.setv({ [name]: value });
                    return this;
                },
                configurable: false,
                enumerable: true,
            });
            const [type, default_value, options] = prop;
            const refined_prop = {
                type,
                default_value: this._fix_default(default_value, name),
                options,
            };
            const props = clone(this.prototype._props);
            props[name] = refined_prop;
            this.prototype._props = props;
        }
    }
    static internal(obj) {
        const _object = {};
        for (const [name, entry] of entries(obj)) {
            const [type, default_value, options = {}] = entry;
            _object[name] = [type, default_value, Object.assign(Object.assign({}, options), { internal: true })];
        }
        this.define(_object);
    }
    static mixins(defs) {
        if (!isArray(defs))
            defs = [defs];
        function resolve(kind) {
            switch (kind) {
                case "line": return mixins.LineVector;
                case "fill": return mixins.FillVector;
                case "hatch": return mixins.HatchVector;
                case "text": return mixins.TextVector;
                default:
                    throw new Error(`Unknown property mixin kind '${kind}'`);
            }
        }
        function rename(prefix, mixin) {
            const result = {};
            for (const [name, prop] of entries(mixin)) {
                result[prefix + name] = prop;
            }
            return result;
        }
        function kind_of(mixin) {
            const [key] = Object.keys(mixin);
            const [kind] = key.split("_", 1);
            return kind;
        }
        const mixin_defs = {};
        const names = [];
        for (const def of defs) {
            if (isString(def)) {
                // TODO: remove this branch in 3.0
                const [kind, prefix = ""] = def.split(":");
                const mixin = resolve(kind);
                names.push(def);
                extend(mixin_defs, rename(prefix, mixin));
            }
            else if (isArray(def)) {
                const [prefix, mixin] = def;
                names.push(`${kind_of(mixin)}:${prefix}`);
                extend(mixin_defs, rename(prefix, mixin));
            }
            else {
                const mixin = def;
                names.push(kind_of(mixin));
                extend(mixin_defs, mixin);
            }
        }
        this.define(mixin_defs);
        this.prototype._mixins = [...this.prototype._mixins, ...names];
    }
    static override(obj) {
        for (const [name, prop] of entries(obj)) {
            const default_value = this._fix_default(prop, name);
            const value = this.prototype._props[name];
            if (value == null)
                throw new Error(`attempted to override nonexistent '${this.prototype.type}.${name}'`);
            const props = clone(this.prototype._props);
            props[name] = Object.assign(Object.assign({}, value), { default_value });
            this.prototype._props = props;
        }
    }
    toString() {
        return `${this.type}(${this.id})`;
    }
    property(name) {
        const prop = this.properties[name];
        if (prop != null)
            return prop;
        else
            throw new Error(`unknown property ${this.type}.${name}`);
    }
    get attributes() {
        const attrs = {}; // Object.create(null)
        for (const prop of this) {
            attrs[prop.attr] = prop.get_value();
        }
        return attrs;
    }
    [equals](that, cmp) {
        for (const p0 of this) {
            const p1 = that.property(p0.attr);
            if (cmp.eq(p0.get_value(), p1.get_value()))
                return false;
        }
        return true;
    }
    [pretty](printer) {
        const T = printer.token;
        const items = [];
        for (const prop of this) {
            if (prop.dirty) {
                const value = prop.get_value();
                items.push(`${prop.attr}${T(":")} ${printer.to_string(value)}`);
            }
        }
        const cls = this.constructor.__qualified__;
        return `${cls}${T("(")}${T("{")}${items.join(`${T(",")} `)}${T("}")}${T(")")}`;
    }
    finalize() {
        for (const prop of this) {
            if (prop.spec.transform != null)
                this.connect(prop.spec.transform.change, () => this.transformchange.emit());
        }
        this.initialize();
    }
    initialize() { }
    connect_signals() { }
    disconnect_signals() {
        Signal.disconnectReceiver(this);
    }
    destroy() {
        this.disconnect_signals();
        this.destroyed.emit();
    }
    // Create a new model with identical attributes to this one.
    clone() {
        return new this.constructor(this.attributes);
    }
    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    _setv(changes, options) {
        // Extract attributes and options.
        const check_eq = options.check_eq;
        const changed = [];
        const changing = this._changing;
        this._changing = true;
        for (const [prop, value] of changes) {
            if (check_eq === false || !isEqual(prop.get_value(), value)) {
                prop.set_value(value);
                changed.push(prop);
            }
        }
        // Trigger all relevant attribute changes.
        if (changed.length > 0)
            this._pending = true;
        for (const prop of changed) {
            prop.change.emit();
        }
        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing)
            return;
        if (!options.no_change) {
            while (this._pending) {
                this._pending = false;
                this.change.emit();
            }
        }
        this._pending = false;
        this._changing = false;
    }
    setv(changed_attrs, options = {}) {
        const changes = entries(changed_attrs);
        if (changes.length == 0)
            return;
        if (options.silent === true) {
            for (const [attr, value] of changes) {
                this.properties[attr].set_value(value);
            }
            return;
        }
        const changed = new Map();
        const previous = new Map();
        for (const [attr, value] of changes) {
            const prop = this.properties[attr];
            changed.set(prop, value);
            previous.set(prop, prop.get_value());
        }
        this._setv(changed, options);
        const { document } = this;
        if (document != null) {
            const changed = [];
            for (const [prop, value] of previous) {
                changed.push([prop, value, prop.get_value()]);
            }
            for (const [, old_value, new_value] of changed) {
                if (this._needs_invalidate(old_value, new_value)) {
                    document._invalidate_all_models();
                    break;
                }
            }
            this._push_changes(changed, options);
        }
    }
    /** @deprecated */
    getv(name) {
        return this.property(name).get_value();
    }
    ref() {
        return { id: this.id };
    }
    struct() {
        const struct = {
            type: this.type,
            id: this.id,
            attributes: {},
        };
        if (this._subtype != null) {
            struct.subtype = this._subtype;
        }
        return struct;
    }
    // we only keep the subtype so we match Python;
    // only Python cares about this
    set_subtype(subtype) {
        this._subtype = subtype;
    }
    *[Symbol.iterator]() {
        yield* values(this.properties);
    }
    *syncable_properties() {
        for (const prop of this) {
            if (prop.syncable)
                yield prop;
        }
    }
    /** @deprecated */
    serializable_attributes() {
        const attrs = {};
        for (const prop of this.syncable_properties()) {
            attrs[prop.attr] = prop.get_value();
        }
        return attrs;
    }
    static _value_to_json(value) {
        if (value instanceof HasProps)
            return value.ref();
        else if (is_NDArray(value))
            return encode_NDArray(value);
        else if (isArray(value) || isTypedArray(value)) {
            const n = value.length;
            const ref_array = new Array(n);
            for (let i = 0; i < n; i++) {
                const v = value[i];
                ref_array[i] = HasProps._value_to_json(v);
            }
            return ref_array;
        }
        else if (isPlainObject(value)) {
            const ref_obj = {};
            for (const [subkey, subvalue] of entries(value)) {
                ref_obj[subkey] = HasProps._value_to_json(subvalue);
            }
            return ref_obj;
        }
        else
            return value;
    }
    // Convert attributes to "shallow" JSON (values which are themselves models
    // are included as just references)
    attributes_as_json(include_defaults = true, value_to_json = HasProps._value_to_json) {
        const attributes = {}; // Object.create(null)
        for (const prop of this) {
            if (prop.syncable && (include_defaults || prop.dirty)) {
                attributes[prop.attr] = value_to_json(prop.get_value());
            }
        }
        return attributes;
    }
    // this is like _value_record_references but expects to find refs
    // instead of models, and takes a doc to look up the refs in
    static _json_record_references(doc, v, refs, options) {
        const { recursive } = options;
        if (is_ref(v)) {
            const model = doc.get_model_by_id(v.id);
            if (model != null && !refs.has(model)) {
                HasProps._value_record_references(model, refs, { recursive });
            }
        }
        else if (isArray(v)) {
            for (const elem of v)
                HasProps._json_record_references(doc, elem, refs, { recursive });
        }
        else if (isPlainObject(v)) {
            for (const elem of values(v)) {
                HasProps._json_record_references(doc, elem, refs, { recursive });
            }
        }
    }
    // add all references from 'v' to 'result', if recurse
    // is true then descend into refs, if false only
    // descend into non-refs
    static _value_record_references(v, refs, options) {
        const { recursive } = options;
        if (v instanceof HasProps) {
            if (!refs.has(v)) {
                refs.add(v);
                if (recursive) {
                    const immediate = v._immediate_references();
                    for (const obj of immediate)
                        HasProps._value_record_references(obj, refs, { recursive: true });
                }
            }
        }
        else if (isArray(v)) {
            for (const elem of v)
                HasProps._value_record_references(elem, refs, { recursive });
        }
        else if (isPlainObject(v)) {
            for (const elem of values(v)) {
                HasProps._value_record_references(elem, refs, { recursive });
            }
        }
    }
    // Get models that are immediately referenced by our properties
    // (do not recurse, do not include ourselves)
    _immediate_references() {
        const refs = new Set();
        for (const prop of this.syncable_properties()) {
            const value = prop.get_value();
            HasProps._value_record_references(value, refs, { recursive: false });
        }
        return refs;
    }
    references() {
        const refs = new Set();
        HasProps._value_record_references(this, refs, { recursive: true });
        return refs;
    }
    _doc_attached() { }
    _doc_detached() { }
    attach_document(doc) {
        // This should only be called by the Document implementation to set the document field
        if (this.document != null && this.document != doc)
            throw new Error("models must be owned by only a single document");
        this.document = doc;
        this._doc_attached();
    }
    detach_document() {
        // This should only be called by the Document implementation to unset the document field
        this._doc_detached();
        this.document = null;
    }
    _needs_invalidate(old_value, new_value) {
        const new_refs = new Set();
        HasProps._value_record_references(new_value, new_refs, { recursive: false });
        const old_refs = new Set();
        HasProps._value_record_references(old_value, old_refs, { recursive: false });
        for (const new_id of new_refs) {
            if (!old_refs.has(new_id))
                return true;
        }
        for (const old_id of old_refs) {
            if (!new_refs.has(old_id))
                return true;
        }
        return false;
    }
    _push_changes(changes, options = {}) {
        const { document } = this;
        if (document == null)
            return;
        const { setter_id } = options;
        const events = [];
        for (const [prop, old_value, new_value] of changes) {
            if (prop.syncable)
                events.push(new ModelChangedEvent(document, this, prop.attr, old_value, new_value, setter_id));
        }
        if (events.length != 0) {
            let event;
            if (events.length == 1)
                [event] = events;
            else
                event = new DocumentEventBatch(document, events, setter_id);
            document._trigger_on_change(event);
        }
    }
    materialize_dataspecs(source) {
        // Note: this should be moved to a function separate from HasProps
        const data = {};
        for (const prop of this) {
            if (!(prop instanceof p.VectorSpec))
                continue;
            // this skips optional properties like radius for circles
            if (prop.optional && prop.spec.value == null && !prop.dirty)
                continue;
            const name = prop.attr;
            const array = prop.array(source);
            data[`_${name}`] = array;
            if (prop instanceof p.DistanceSpec)
                data[`max_${name}`] = max(array);
        }
        return data;
    }
    on_change(properties, fn) {
        for (const property of isArray(properties) ? properties : [properties]) {
            this.connect(property.change, fn);
        }
    }
}
HasProps.init_HasProps();
//# sourceMappingURL=has_props.js.map