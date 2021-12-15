import { InspectTool, InspectToolView } from "./inspect_tool";
import { Renderer } from "../../renderers/renderer";
import { Span } from "../../annotations/span";
import { Dimensions } from "../../../core/enums";
import { MoveEvent } from "../../../core/ui_events";
import * as p from "../../../core/properties";
import { Color } from "../../../core/types";
export declare class CrosshairToolView extends InspectToolView {
    model: CrosshairTool;
    _move(ev: MoveEvent): void;
    _move_exit(_e: MoveEvent): void;
    _update_spans(x: number | null, y: number | null): void;
}
export declare namespace CrosshairTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = InspectTool.Props & {
        dimensions: p.Property<Dimensions>;
        line_color: p.Property<Color>;
        line_width: p.Property<number>;
        line_alpha: p.Property<number>;
        spans: p.Property<{
            width: Span;
            height: Span;
        }>;
    };
}
export interface CrosshairTool extends CrosshairTool.Attrs {
}
export declare class CrosshairTool extends InspectTool {
    properties: CrosshairTool.Props;
    __view_type__: CrosshairToolView;
    constructor(attrs?: Partial<CrosshairTool.Attrs>);
    static init_CrosshairTool(): void;
    tool_name: string;
    icon: string;
    get tooltip(): string;
    get synthetic_renderers(): Renderer[];
    initialize(): void;
}
