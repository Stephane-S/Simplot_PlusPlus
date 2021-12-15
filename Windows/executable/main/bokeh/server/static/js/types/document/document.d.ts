import { BokehEvent, ModelEvent } from "../core/bokeh_events";
import { HasProps } from "../core/has_props";
import { ID, Attrs } from "../core/types";
import { Signal0 } from "../core/signaling";
import { Struct } from "../core/util/refs";
import { Buffers } from "../core/util/serialization";
import { LayoutDOM } from "../models/layouts/layout_dom";
import { ClientSession } from "../client/session";
import { Model } from "../model";
import { DocumentEvent, DocumentChangedEvent, DocumentChanged, ModelChanged } from "./events";
export declare class EventManager {
    readonly document: Document;
    session: ClientSession | null;
    subscribed_models: Set<Model>;
    constructor(document: Document);
    send_event(bokeh_event: BokehEvent): void;
    trigger(event: ModelEvent): void;
}
export interface DocJson {
    version?: string;
    title?: string;
    roots: {
        root_ids: string[];
        references: Struct[];
    };
}
export interface Patch {
    references: Struct[];
    events: DocumentChanged[];
}
export declare type RefMap = Map<ID, HasProps>;
export declare const documents: Document[];
export declare const DEFAULT_TITLE = "Bokeh Application";
export declare class Document {
    readonly event_manager: EventManager;
    readonly idle: Signal0<this>;
    protected readonly _init_timestamp: number;
    protected _title: string;
    protected _roots: Model[];
    _all_models: Map<ID, HasProps>;
    protected _all_models_freeze_count: number;
    protected _callbacks: Map<(event: DocumentEvent) => void, boolean>;
    protected _message_callbacks: Map<string, Set<(data: unknown) => void>>;
    private _idle_roots;
    protected _interactive_timestamp: number | null;
    protected _interactive_plot: Model | null;
    constructor();
    get layoutables(): LayoutDOM[];
    get is_idle(): boolean;
    notify_idle(model: Model): void;
    clear(): void;
    interactive_start(plot: Model): void;
    interactive_stop(): void;
    interactive_duration(): number;
    destructively_move(dest_doc: Document): void;
    protected _push_all_models_freeze(): void;
    protected _pop_all_models_freeze(): void;
    _invalidate_all_models(): void;
    protected _recompute_all_models(): void;
    roots(): Model[];
    add_root(model: Model, setter_id?: string): void;
    remove_root(model: Model, setter_id?: string): void;
    title(): string;
    set_title(title: string, setter_id?: string): void;
    get_model_by_id(model_id: string): HasProps | null;
    get_model_by_name(name: string): HasProps | null;
    on_message(msg_type: string, callback: (msg_data: unknown) => void): void;
    remove_on_message(msg_type: string, callback: (msg_data: unknown) => void): void;
    protected _trigger_on_message(msg_type: string, msg_data: unknown): void;
    on_change(callback: (event: DocumentEvent) => void, allow_batches: true): void;
    on_change(callback: (event: DocumentChangedEvent) => void, allow_batches?: false): void;
    remove_on_change(callback: (event: DocumentEvent) => void): void;
    _trigger_on_change(event: DocumentEvent): void;
    _notify_change(model: HasProps, attr: string, old_value: unknown, new_value: unknown, options?: {
        setter_id?: string;
        hint?: unknown;
    }): void;
    static _references_json(references: Iterable<HasProps>, include_defaults?: boolean): Struct[];
    static _instantiate_object(obj_id: string, obj_type: string, obj_attrs: Attrs): HasProps;
    static _instantiate_references_json(references_json: Struct[], existing_models: RefMap): RefMap;
    static _resolve_refs(value: unknown, old_references: RefMap, new_references: RefMap, buffers: Buffers): unknown;
    static _initialize_references_json(references_json: Struct[], old_references: RefMap, new_references: RefMap, buffers: Buffers): void;
    static _event_for_attribute_change(changed_obj: Struct, key: string, new_value: any, doc: Document, value_refs: Set<HasProps>): ModelChanged | null;
    static _events_to_sync_objects(from_obj: Struct, to_obj: Struct, to_doc: Document, value_refs: Set<HasProps>): ModelChanged[];
    static _compute_patch_since_json(from_json: DocJson, to_doc: Document): Patch;
    to_json_string(include_defaults?: boolean): string;
    to_json(include_defaults?: boolean): DocJson;
    static from_json_string(s: string): Document;
    static from_json(json: DocJson): Document;
    replace_with_json(json: DocJson): void;
    create_json_patch_string(events: DocumentChangedEvent[]): string;
    create_json_patch(events: DocumentChangedEvent[]): Patch;
    apply_json_patch(patch: Patch, buffers?: Buffers | ReturnType<Buffers["entries"]>, setter_id?: string): void;
}
