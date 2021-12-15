import * as p from "../../core/properties";
import { View } from "../../core/view";
import { Dimensions } from "../../core/enums";
import { Model } from "../../model";
import { Renderer } from "../renderers/renderer";
import { CartesianFrame } from "../canvas/cartesian_frame";
import { Plot, PlotView } from "../plots/plot";
import { Annotation } from "../annotations/annotation";
import { EventType, PanEvent, PinchEvent, RotateEvent, ScrollEvent, TapEvent, MoveEvent, KeyEvent } from "../../core/ui_events";
import type { PanTool } from "./gestures/pan_tool";
import type { WheelPanTool } from "./gestures/wheel_pan_tool";
import type { WheelZoomTool } from "./gestures/wheel_zoom_tool";
import type { ZoomInTool } from "./actions/zoom_in_tool";
import type { ZoomOutTool } from "./actions/zoom_out_tool";
import type { TapTool } from "./gestures/tap_tool";
import type { CrosshairTool } from "./inspectors/crosshair_tool";
import type { BoxSelectTool } from "./gestures/box_select_tool";
import type { PolySelectTool } from "./gestures/poly_select_tool";
import type { LassoSelectTool } from "./gestures/lasso_select_tool";
import type { BoxZoomTool } from "./gestures/box_zoom_tool";
import type { HoverTool } from "./inspectors/hover_tool";
import type { SaveTool } from "./actions/save_tool";
import type { UndoTool } from "./actions/undo_tool";
import type { RedoTool } from "./actions/redo_tool";
import type { ResetTool } from "./actions/reset_tool";
import type { HelpTool } from "./actions/help_tool";
export declare type ToolAliases = {
    pan: PanTool;
    xpan: PanTool;
    ypan: PanTool;
    xwheel_pan: WheelPanTool;
    ywheel_pan: WheelPanTool;
    wheel_zoom: WheelZoomTool;
    xwheel_zoom: WheelZoomTool;
    ywheel_zoom: WheelZoomTool;
    zoom_in: ZoomInTool;
    xzoom_in: ZoomInTool;
    yzoom_in: ZoomInTool;
    zoom_out: ZoomOutTool;
    xzoom_out: ZoomOutTool;
    yzoom_out: ZoomOutTool;
    click: TapTool;
    tap: TapTool;
    crosshair: CrosshairTool;
    box_select: BoxSelectTool;
    xbox_select: BoxSelectTool;
    ybox_select: BoxSelectTool;
    poly_select: PolySelectTool;
    lasso_select: LassoSelectTool;
    box_zoom: BoxZoomTool;
    xbox_zoom: BoxZoomTool;
    ybox_zoom: BoxZoomTool;
    hover: HoverTool;
    save: SaveTool;
    undo: UndoTool;
    redo: RedoTool;
    reset: ResetTool;
    help: HelpTool;
};
export declare abstract class ToolView extends View {
    model: Tool;
    parent: PlotView;
    get plot_view(): PlotView;
    get plot_model(): Plot;
    connect_signals(): void;
    activate(): void;
    deactivate(): void;
    _pan_start?(e: PanEvent): void;
    _pan?(e: PanEvent): void;
    _pan_end?(e: PanEvent): void;
    _pinch_start?(e: PinchEvent): void;
    _pinch?(e: PinchEvent): void;
    _pinch_end?(e: PinchEvent): void;
    _rotate_start?(e: RotateEvent): void;
    _rotate?(e: RotateEvent): void;
    _rotate_end?(e: RotateEvent): void;
    _tap?(e: TapEvent): void;
    _doubletap?(e: TapEvent): void;
    _press?(e: TapEvent): void;
    _pressup?(e: TapEvent): void;
    _move_enter?(e: MoveEvent): void;
    _move?(e: MoveEvent): void;
    _move_exit?(e: MoveEvent): void;
    _scroll?(e: ScrollEvent): void;
    _keydown?(e: KeyEvent): void;
    _keyup?(e: KeyEvent): void;
}
export declare namespace Tool {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        active: p.Property<boolean>;
    };
}
export interface Tool extends Tool.Attrs {
    overlay?: Annotation;
}
export declare abstract class Tool extends Model {
    properties: Tool.Props;
    __view_type__: ToolView;
    constructor(attrs?: Partial<Tool.Attrs>);
    static init_Tool(): void;
    readonly event_type?: EventType | EventType[];
    get synthetic_renderers(): Renderer[];
    protected _get_dim_tooltip(name: string, dims: Dimensions): string;
    _get_dim_limits([sx0, sy0]: [number, number], [sx1, sy1]: [number, number], frame: CartesianFrame, dims: Dimensions): [[number, number], [number, number]];
    /** @prototype */
    private _known_aliases;
    static register_alias(name: string, fn: () => Tool): void;
    static from_string<K extends keyof ToolAliases>(name: K): ToolAliases[K];
    static from_string(name: string): Tool;
}
