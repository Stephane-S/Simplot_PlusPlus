import { Document } from "./document";
import { Data } from "../core/types";
import { HasProps } from "../core/has_props";
import { Ref } from "../core/util/refs";
import { PatchSet } from "../models/sources/column_data_source";
export interface ModelChanged {
    kind: "ModelChanged";
    model: Ref;
    attr: string;
    new: any;
    hint?: any;
}
export interface MessageSent {
    kind: "MessageSent";
    msg_type: string;
    msg_data?: unknown;
}
export interface TitleChanged {
    kind: "TitleChanged";
    title: string;
}
export interface RootAdded {
    kind: "RootAdded";
    model: Ref;
}
export interface RootRemoved {
    kind: "RootRemoved";
    model: Ref;
}
export interface ColumnDataChanged {
    kind: "ColumnDataChanged";
    column_source: Ref;
    cols?: any;
    new: any;
}
export interface ColumnsStreamed {
    kind: "ColumnsStreamed";
    column_source: Ref;
    data: Data;
    rollover?: number;
}
export interface ColumnsPatched {
    kind: "ColumnsPatched";
    column_source: Ref;
    patches: PatchSet<unknown>;
}
export declare type DocumentChanged = ModelChanged | MessageSent | TitleChanged | RootAdded | RootRemoved | ColumnDataChanged | ColumnsStreamed | ColumnsPatched;
export declare abstract class DocumentEvent {
    readonly document: Document;
    constructor(document: Document);
}
export declare class DocumentEventBatch<T extends DocumentChangedEvent> extends DocumentEvent {
    readonly events: T[];
    readonly setter_id?: string | undefined;
    constructor(document: Document, events: T[], setter_id?: string | undefined);
}
export declare abstract class DocumentChangedEvent extends DocumentEvent {
    abstract json(references: Set<HasProps>): DocumentChanged;
}
export declare class MessageSentEvent extends DocumentChangedEvent {
    readonly msg_type: string;
    readonly msg_data: unknown;
    constructor(document: Document, msg_type: string, msg_data: unknown);
    json(_references: Set<HasProps>): DocumentChanged;
}
export declare class ModelChangedEvent extends DocumentChangedEvent {
    readonly model: HasProps;
    readonly attr: string;
    readonly old: unknown;
    readonly new_: unknown;
    readonly setter_id?: string | undefined;
    readonly hint?: any;
    constructor(document: Document, model: HasProps, attr: string, old: unknown, new_: unknown, setter_id?: string | undefined, hint?: any);
    json(references: Set<HasProps>): DocumentChanged;
}
export declare class ColumnsPatchedEvent extends DocumentChangedEvent {
    readonly column_source: Ref;
    readonly patches: PatchSet<unknown>;
    constructor(document: Document, column_source: Ref, patches: PatchSet<unknown>);
    json(_references: Set<HasProps>): ColumnsPatched;
}
export declare class ColumnsStreamedEvent extends DocumentChangedEvent {
    readonly column_source: Ref;
    readonly data: Data;
    readonly rollover?: number | undefined;
    constructor(document: Document, column_source: Ref, data: Data, rollover?: number | undefined);
    json(_references: Set<HasProps>): ColumnsStreamed;
}
export declare class TitleChangedEvent extends DocumentChangedEvent {
    readonly title: string;
    readonly setter_id?: string | undefined;
    constructor(document: Document, title: string, setter_id?: string | undefined);
    json(_references: Set<HasProps>): TitleChanged;
}
export declare class RootAddedEvent extends DocumentChangedEvent {
    readonly model: HasProps;
    readonly setter_id?: string | undefined;
    constructor(document: Document, model: HasProps, setter_id?: string | undefined);
    json(references: Set<HasProps>): RootAdded;
}
export declare class RootRemovedEvent extends DocumentChangedEvent {
    readonly model: HasProps;
    readonly setter_id?: string | undefined;
    constructor(document: Document, model: HasProps, setter_id?: string | undefined);
    json(_references: Set<HasProps>): RootRemoved;
}
