import { Visuals, Line, Fill, Hatch } from "../../core/visuals";
import { Context2d } from "../../core/util/canvas";
import { Rect } from "../../core/types";
import { PointGeometry, SpanGeometry } from "../../core/geometry";
import { GlyphRendererView } from "../renderers/glyph_renderer";
export declare function generic_line_legend(visuals: Visuals & {
    line: Line;
}, ctx: Context2d, { x0, x1, y0, y1 }: Rect, index: number): void;
export declare function generic_area_legend(visuals: {
    line?: Line;
    fill: Fill;
    hatch?: Hatch;
}, ctx: Context2d, { x0, x1, y0, y1 }: Rect, index: number): void;
export declare function line_interpolation(renderer: GlyphRendererView, geometry: PointGeometry | SpanGeometry, x2: number, y2: number, x3: number, y3: number): [number, number];
