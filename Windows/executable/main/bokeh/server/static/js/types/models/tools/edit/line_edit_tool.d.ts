import { PanEvent, TapEvent } from "../../../core/ui_events";
import { Dimensions } from "../../../core/enums";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { LineTool, LineToolView } from "./line_tool";
import * as p from "../../../core/properties";
import { Line } from "../../glyphs/line";
export interface HasLineGlyph {
    glyph: Line;
}
export declare class LineEditToolView extends LineToolView {
    model: LineEditTool;
    _selected_renderer: GlyphRenderer | null;
    _basepoint: [number, number] | null;
    _drawing: boolean;
    _doubletap(ev: TapEvent): void;
    _show_intersections(): void;
    _tap(ev: TapEvent): void;
    _update_line_cds(): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
    activate(): void;
    deactivate(): void;
}
export declare namespace LineEditTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = LineTool.Props & {
        dimensions: p.Property<Dimensions>;
    };
}
export interface LineEditTool extends LineEditTool.Attrs {
}
export declare class LineEditTool extends LineTool {
    properties: LineEditTool.Props;
    __view_type__: LineEditToolView;
    constructor(attrs?: Partial<LineEditTool.Attrs>);
    static init_LineEditTool(): void;
    tool_name: string;
    icon: string;
    event_type: ("pan" | "tap" | "move")[];
    default_order: number;
    get tooltip(): string;
}
