import { SelectTool, SelectToolView } from "./select_tool";
import { BoxAnnotation } from "../../annotations/box_annotation";
import * as p from "../../../core/properties";
import { Dimensions, BoxOrigin, SelectionMode } from "../../../core/enums";
import { PanEvent } from "../../../core/ui_events";
export declare class BoxSelectToolView extends SelectToolView {
    model: BoxSelectTool;
    protected _base_point: [number, number] | null;
    protected _compute_limits(curpoint: [number, number]): [[number, number], [number, number]];
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
    _do_select([sx0, sx1]: [number, number], [sy0, sy1]: [number, number], final: boolean, mode?: SelectionMode): void;
}
export declare namespace BoxSelectTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = SelectTool.Props & {
        dimensions: p.Property<Dimensions>;
        select_every_mousemove: p.Property<boolean>;
        overlay: p.Property<BoxAnnotation>;
        origin: p.Property<BoxOrigin>;
    };
}
export interface BoxSelectTool extends BoxSelectTool.Attrs {
}
export declare class BoxSelectTool extends SelectTool {
    properties: BoxSelectTool.Props;
    __view_type__: BoxSelectToolView;
    /** @override */
    overlay: BoxAnnotation;
    constructor(attrs?: Partial<BoxSelectTool.Attrs>);
    static init_BoxSelectTool(): void;
    tool_name: string;
    icon: string;
    event_type: "pan";
    default_order: number;
    get tooltip(): string;
}
