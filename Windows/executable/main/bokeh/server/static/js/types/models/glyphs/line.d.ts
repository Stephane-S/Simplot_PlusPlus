import { XYGlyph, XYGlyphView, XYGlyphData } from "./xy_glyph";
import { PointGeometry, SpanGeometry } from "../../core/geometry";
import { Rect } from "../../core/types";
import * as p from "../../core/properties";
import * as mixins from "../../core/property_mixins";
import * as visuals from "../../core/visuals";
import { Context2d } from "../../core/util/canvas";
import { Selection } from "../selections/selection";
export interface LineData extends XYGlyphData {
}
export interface LineView extends LineData {
}
export declare class LineView extends XYGlyphView {
    model: Line;
    visuals: Line.Visuals;
    initialize(): void;
    protected _render(ctx: Context2d, indices: number[], { sx, sy }: LineData): void;
    protected _hit_point(geometry: PointGeometry): Selection;
    protected _hit_span(geometry: SpanGeometry): Selection;
    get_interpolation_hit(i: number, geometry: PointGeometry | SpanGeometry): [number, number];
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
}
export declare namespace Line {
    type Attrs = p.AttrsOf<Props>;
    type Props = XYGlyph.Props & Mixins;
    type Mixins = mixins.Line;
    type Visuals = XYGlyph.Visuals & {
        line: visuals.Line;
    };
}
export interface Line extends Line.Attrs {
}
export declare class Line extends XYGlyph {
    properties: Line.Props;
    __view_type__: LineView;
    constructor(attrs?: Partial<Line.Attrs>);
    static init_Line(): void;
}
