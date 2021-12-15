import * as p from "../../../core/properties";
import { Line } from "../../glyphs/line";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { EditTool, EditToolView, HasXYGlyph } from "./edit_tool";
export interface HasLineGlyph {
    glyph: Line;
}
export declare class LineToolView extends EditToolView {
    model: LineTool;
    _set_intersection(x: number[] | number, y: number[] | number): void;
    _hide_intersections(): void;
}
export declare namespace LineTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = EditTool.Props & {
        renderers: p.Property<(GlyphRenderer & HasLineGlyph)[]>;
        intersection_renderer: p.Property<(GlyphRenderer & HasXYGlyph & HasLineGlyph)>;
    };
}
export interface LineTool extends LineTool.Attrs {
}
export declare class LineTool extends EditTool {
    properties: LineTool.Props;
    __view_type__: LineToolView;
    renderers: (GlyphRenderer & HasLineGlyph)[];
    constructor(attrs?: Partial<LineTool.Attrs>);
    static init_LineTool(): void;
}
