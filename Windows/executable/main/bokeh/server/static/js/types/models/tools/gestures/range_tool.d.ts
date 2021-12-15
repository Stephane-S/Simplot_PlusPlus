import { PanEvent } from "../../../core/ui_events";
import { BoxAnnotation } from "../../annotations/box_annotation";
import { Range } from "../../ranges/range";
import { Range1d } from "../../ranges/range1d";
import { Scale } from '../../scales/scale';
import * as p from "../../../core/properties";
import { GestureTool, GestureToolView } from "./gesture_tool";
export declare const enum Side {
    None = 0,
    Left = 1,
    Right = 2,
    LeftRight = 3,
    Bottom = 4,
    Top = 5,
    BottomTop = 6,
    LeftRightBottomTop = 7
}
export declare function flip_side(side: Side): Side;
export declare function is_near(pos: number, value: number | null, scale: Scale, tolerance: number): boolean;
export declare function is_inside(sx: number, sy: number, xscale: Scale, yscale: Scale, overlay: BoxAnnotation): boolean;
export declare function sides_inside(start: number, end: number, range: Range): number;
export declare function compute_value(value: number, scale: Scale, sdelta: number, range: Range): number;
export declare function update_range_end_side(end: number, range: Range, side: Side): Side;
export declare function update_range_start_side(start: number, range: Range, side: Side): Side;
export declare function update_range(range: Range1d, scale: Scale, delta: number, plot_range: Range): void;
export declare class RangeToolView extends GestureToolView {
    model: RangeTool;
    private last_dx;
    private last_dy;
    private side;
    initialize(): void;
    connect_signals(): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(_ev: PanEvent): void;
}
export declare namespace RangeTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = GestureTool.Props & {
        x_range: p.Property<Range1d | null>;
        x_interaction: p.Property<boolean>;
        y_range: p.Property<Range1d | null>;
        y_interaction: p.Property<boolean>;
        overlay: p.Property<BoxAnnotation>;
    };
}
export interface RangeTool extends RangeTool.Attrs {
}
export declare class RangeTool extends GestureTool {
    properties: RangeTool.Props;
    __view_type__: RangeToolView;
    overlay: BoxAnnotation;
    constructor(attrs?: Partial<RangeTool.Attrs>);
    static init_RangeTool(): void;
    initialize(): void;
    update_overlay_from_ranges(): void;
    tool_name: string;
    icon: string;
    event_type: "pan";
    default_order: number;
}
