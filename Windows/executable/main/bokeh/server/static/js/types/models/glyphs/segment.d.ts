import { PointGeometry, SpanGeometry } from "../../core/geometry";
import * as p from "../../core/properties";
import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { Rect, NumberArray } from "../../core/types";
import { SpatialIndex } from "../../core/util/spatial";
import { Context2d } from "../../core/util/canvas";
import { Glyph, GlyphView, GlyphData } from "./glyph";
import { Selection } from "../selections/selection";
export interface SegmentData extends GlyphData {
    _x0: NumberArray;
    _y0: NumberArray;
    _x1: NumberArray;
    _y1: NumberArray;
    sx0: NumberArray;
    sy0: NumberArray;
    sx1: NumberArray;
    sy1: NumberArray;
}
export interface SegmentView extends SegmentData {
}
export declare class SegmentView extends GlyphView {
    model: Segment;
    visuals: Segment.Visuals;
    protected _project_data(): void;
    protected _index_data(index: SpatialIndex): void;
    protected _render(ctx: Context2d, indices: number[], { sx0, sy0, sx1, sy1 }: SegmentData): void;
    protected _hit_point(geometry: PointGeometry): Selection;
    protected _hit_span(geometry: SpanGeometry): Selection;
    scenterxy(i: number): [number, number];
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
}
export declare namespace Segment {
    type Attrs = p.AttrsOf<Props>;
    type Props = Glyph.Props & {
        x0: p.CoordinateSpec;
        y0: p.CoordinateSpec;
        x1: p.CoordinateSpec;
        y1: p.CoordinateSpec;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = Glyph.Visuals & {
        line: Line;
    };
}
export interface Segment extends Segment.Attrs {
}
export declare class Segment extends Glyph {
    properties: Segment.Props;
    __view_type__: SegmentView;
    constructor(attrs?: Partial<Segment.Attrs>);
    static init_Segment(): void;
}
