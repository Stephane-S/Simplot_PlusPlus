import type { HasProps } from "./has_props";
import { Property } from "./properties";
import { Signal0, Signal, Slot, ISignalable } from "./signaling";
import { StyleSheet } from "./dom";
export declare type ViewOf<T extends HasProps> = T["__view_type__"];
export declare namespace View {
    type Options = {
        model: HasProps;
        parent: View | null;
    };
}
export declare class View implements ISignalable {
    readonly removed: Signal0<this>;
    readonly model: HasProps;
    private _parent;
    protected _ready: Promise<void>;
    get ready(): Promise<void>;
    protected _has_finished: boolean;
    connect<Args, Sender extends object>(signal: Signal<Args, Sender>, slot: Slot<Args, Sender>): boolean;
    disconnect<Args, Sender extends object>(signal: Signal<Args, Sender>, slot: Slot<Args, Sender>): boolean;
    constructor(options: View.Options);
    initialize(): void;
    lazy_initialize(): Promise<void>;
    remove(): void;
    toString(): string;
    serializable_state(): {
        [key: string]: unknown;
    };
    get parent(): View | null;
    get is_root(): boolean;
    get root(): View;
    assert_root(): void;
    has_finished(): boolean;
    get is_idle(): boolean;
    connect_signals(): void;
    disconnect_signals(): void;
    on_change(properties: Property<unknown> | Property<unknown>[], fn: () => void): void;
    cursor(_sx: number, _sy: number): string | null;
    on_hit?(sx: number, sy: number): boolean;
    private _stylesheet;
    get stylesheet(): StyleSheet;
    styles(): string[];
}
