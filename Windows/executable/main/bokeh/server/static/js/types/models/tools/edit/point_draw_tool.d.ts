import { PanEvent, TapEvent, KeyEvent } from "../../../core/ui_events";
import * as p from "../../../core/properties";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { EditTool, EditToolView, HasXYGlyph } from "./edit_tool";
export declare class PointDrawToolView extends EditToolView {
    model: PointDrawTool;
    _tap(ev: TapEvent): void;
    _keyup(ev: KeyEvent): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
}
export declare namespace PointDrawTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = EditTool.Props & {
        add: p.Property<boolean>;
        drag: p.Property<boolean>;
        num_objects: p.Property<number>;
        renderers: p.Property<(GlyphRenderer & HasXYGlyph)[]>;
    };
}
export interface PointDrawTool extends PointDrawTool.Attrs {
}
export declare class PointDrawTool extends EditTool {
    properties: PointDrawTool.Props;
    __view_type__: PointDrawToolView;
    renderers: (GlyphRenderer & HasXYGlyph)[];
    constructor(attrs?: Partial<PointDrawTool.Attrs>);
    static init_PointDrawTool(): void;
    tool_name: string;
    icon: string;
    event_type: ("pan" | "tap" | "move")[];
    default_order: number;
}
