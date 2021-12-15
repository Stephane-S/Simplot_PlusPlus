import { PanEvent, TapEvent, MoveEvent, KeyEvent, UIEvent } from "../../../core/ui_events";
import { MultiLine } from "../../glyphs/multi_line";
import { Patches } from "../../glyphs/patches";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { PolyTool, PolyToolView } from "./poly_tool";
import * as p from "../../../core/properties";
export interface HasPolyGlyph {
    glyph: MultiLine | Patches;
}
export declare class PolyEditToolView extends PolyToolView {
    model: PolyEditTool;
    _selected_renderer: GlyphRenderer | null;
    _basepoint: [number, number] | null;
    _drawing: boolean;
    _doubletap(ev: TapEvent): void;
    _show_vertices(ev: UIEvent): void;
    _move(ev: MoveEvent): void;
    _tap(ev: TapEvent): void;
    _remove_vertex(): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
    _keyup(ev: KeyEvent): void;
    deactivate(): void;
}
export declare namespace PolyEditTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = PolyTool.Props;
}
export interface PolyEditTool extends PolyEditTool.Attrs {
}
export declare class PolyEditTool extends PolyTool {
    properties: PolyEditTool.Props;
    __view_type__: PolyEditToolView;
    constructor(attrs?: Partial<PolyEditTool.Attrs>);
    static init_PolyEditTool(): void;
    tool_name: string;
    icon: string;
    event_type: ("pan" | "tap" | "move")[];
    default_order: number;
}
