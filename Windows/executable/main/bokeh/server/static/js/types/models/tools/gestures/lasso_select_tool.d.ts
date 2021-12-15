import { SelectTool, SelectToolView } from "./select_tool";
import { PolyAnnotation } from "../../annotations/poly_annotation";
import { SelectionMode } from "../../../core/enums";
import { PanEvent, KeyEvent } from "../../../core/ui_events";
import * as p from "../../../core/properties";
export declare class LassoSelectToolView extends SelectToolView {
    model: LassoSelectTool;
    protected data: {
        sx: number[];
        sy: number[];
    } | null;
    initialize(): void;
    connect_signals(): void;
    _active_change(): void;
    _keyup(ev: KeyEvent): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
    _clear_overlay(): void;
    _do_select(sx: number[], sy: number[], final: boolean, mode: SelectionMode): void;
}
export declare namespace LassoSelectTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = SelectTool.Props & {
        select_every_mousemove: p.Property<boolean>;
        overlay: p.Property<PolyAnnotation>;
    };
}
export interface LassoSelectTool extends LassoSelectTool.Attrs {
}
export declare class LassoSelectTool extends SelectTool {
    properties: LassoSelectTool.Props;
    __view_type__: LassoSelectToolView;
    overlay: PolyAnnotation;
    constructor(attrs?: Partial<LassoSelectTool.Attrs>);
    static init_LassoSelectTool(): void;
    tool_name: string;
    icon: string;
    event_type: "pan";
    default_order: number;
}
