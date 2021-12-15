import { GestureTool, GestureToolView } from "./gesture_tool";
import * as p from "../../../core/properties";
import { PanEvent } from "../../../core/ui_events";
import { Dimensions } from "../../../core/enums";
import { Interval } from "../../../core/types";
import { Scale } from "../../scales/scale";
export declare function update_ranges(scales: Map<string, Scale>, p0: number, p1: number): Map<string, Interval>;
export declare class PanToolView extends GestureToolView {
    model: PanTool;
    protected last_dx: number;
    protected last_dy: number;
    protected v_axis_only: boolean;
    protected h_axis_only: boolean;
    protected pan_info: {
        xrs: Map<string, Interval>;
        yrs: Map<string, Interval>;
        sdx: number;
        sdy: number;
    };
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(_e: PanEvent): void;
    _update(dx: number, dy: number): void;
}
export declare namespace PanTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = GestureTool.Props & {
        dimensions: p.Property<Dimensions>;
    };
}
export interface PanTool extends PanTool.Attrs {
}
export declare class PanTool extends GestureTool {
    properties: PanTool.Props;
    __view_type__: PanToolView;
    constructor(attrs?: Partial<PanTool.Attrs>);
    static init_PanTool(): void;
    tool_name: string;
    event_type: "pan";
    default_order: number;
    get tooltip(): string;
    get icon(): string;
}
