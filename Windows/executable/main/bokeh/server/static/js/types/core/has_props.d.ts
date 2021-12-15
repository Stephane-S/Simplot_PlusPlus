import { View } from "./view";
import { Class } from "./class";
import { Arrayable, Attrs } from "./types";
import { Signal0, Signal, ISignalable } from "./signaling";
import { Struct, Ref } from "./util/refs";
import * as p from "./properties";
import { Property } from "./properties";
import { ColumnarDataSource } from "../models/sources/columnar_data_source";
import { Document } from "../document";
import { equals, Equals, Comparator } from "./util/eq";
import { pretty, Printable, Printer } from "./util/pretty";
import * as kinds from "./kinds";
export declare module HasProps {
    type Attrs = p.AttrsOf<Props>;
    type Props = {
        id: p.Property<string>;
    };
    interface SetOptions {
        check_eq?: boolean;
        silent?: boolean;
        no_change?: boolean;
        setter_id?: string;
    }
}
export interface HasProps extends HasProps.Attrs, ISignalable {
    constructor: Function & {
        __name__: string;
        __module__?: string;
        __qualified__: string;
    };
    id: string;
}
export declare type PropertyGenerator = Generator<Property, void, undefined>;
declare const HasProps_base: {
    new (): {
        connect<Args, Sender extends object>(signal: Signal<Args, Sender>, slot: import("./signaling").Slot<Args, Sender>): boolean;
        disconnect<Args_1, Sender_1 extends object>(signal: Signal<Args_1, Sender_1>, slot: import("./signaling").Slot<Args_1, Sender_1>): boolean;
    };
};
export declare abstract class HasProps extends HasProps_base implements Equals, Printable {
    __view_type__: View;
    set type(name: string);
    get type(): string;
    static __name__: string;
    static __module__?: string;
    static get __qualified__(): string;
    static get [Symbol.toStringTag](): string;
    static init_HasProps(): void;
    /** @prototype */
    default_view: Class<View, [View.Options]>;
    /** @prototype */
    _props: {
        [key: string]: {
            type: p.PropertyConstructor<unknown>;
            default_value?: () => unknown;
            options: p.PropertyOptions;
        };
    };
    /** @prototype */
    _mixins: string[];
    private static _fix_default;
    static define<T>(obj: Partial<p.DefineOf<T>> | ((types: typeof kinds) => Partial<p.DefineOf<T>>)): void;
    static internal(obj: any): void;
    static mixins<_T>(defs: Attrs | string[] | (Attrs | [string, Attrs])[]): void;
    static override(obj: any): void;
    toString(): string;
    _subtype: string | undefined;
    document: Document | null;
    readonly destroyed: Signal0<this>;
    readonly change: Signal0<this>;
    readonly transformchange: Signal0<this>;
    readonly properties: {
        [key: string]: Property;
    };
    property(name: string): Property;
    get attributes(): Attrs;
    [equals](that: this, cmp: Comparator): boolean;
    [pretty](printer: Printer): string;
    constructor(attrs?: Attrs | Map<string, unknown>);
    finalize(): void;
    initialize(): void;
    connect_signals(): void;
    disconnect_signals(): void;
    destroy(): void;
    clone(): this;
    private _pending;
    private _changing;
    private _setv;
    setv(changed_attrs: Attrs, options?: HasProps.SetOptions): void;
    /** @deprecated */
    getv(name: string): unknown;
    ref(): Ref;
    struct(): Struct;
    set_subtype(subtype: string): void;
    [Symbol.iterator](): PropertyGenerator;
    syncable_properties(): PropertyGenerator;
    /** @deprecated */
    serializable_attributes(): Attrs;
    static _value_to_json(value: unknown): unknown;
    attributes_as_json(include_defaults?: boolean, value_to_json?: typeof HasProps._value_to_json): Attrs;
    static _json_record_references(doc: Document, v: unknown, refs: Set<HasProps>, options: {
        recursive: boolean;
    }): void;
    static _value_record_references(v: unknown, refs: Set<HasProps>, options: {
        recursive: boolean;
    }): void;
    protected _immediate_references(): Set<HasProps>;
    references(): Set<HasProps>;
    protected _doc_attached(): void;
    protected _doc_detached(): void;
    attach_document(doc: Document): void;
    detach_document(): void;
    protected _needs_invalidate(old_value: unknown, new_value: unknown): boolean;
    protected _push_changes(changes: [Property, unknown, unknown][], options?: {
        setter_id?: string;
    }): void;
    materialize_dataspecs(source: ColumnarDataSource): {
        [key: string]: Arrayable<unknown> | number;
    };
    on_change(properties: Property<unknown> | Property<unknown>[], fn: () => void): void;
}
export {};
