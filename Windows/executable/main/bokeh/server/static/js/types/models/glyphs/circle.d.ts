import { XYGlyph, XYGlyphView, XYGlyphData } from "./xy_glyph";
import { PointGeometry, SpanGeometry, RectGeometry, PolyGeometry } from "../../core/geometry";
import { LineVector, FillVector } from "../../core/property_mixins";
import { Line, Fill } from "../../core/visuals";
import { Rect, NumberArray, Indices } from "../../core/types";
import { RadiusDimension } from "../../core/enums";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
import { Selection } from "../selections/selection";
export interface CircleData extends XYGlyphData {
    _angle: NumberArray;
    _size: NumberArray;
    _radius?: NumberArray;
    sradius: NumberArray;
    max_size: number;
    max_radius: number;
}
export interface CircleView extends CircleData {
}
export declare class CircleView extends XYGlyphView {
    model: Circle;
    visuals: Circle.Visuals;
    initialize(): void;
    protected _map_data(): void;
    protected _mask_data(): Indices;
    protected _render(ctx: Context2d, indices: number[], { sx, sy, sradius }: CircleData): void;
    protected _hit_point(geometry: PointGeometry): Selection;
    protected _hit_span(geometry: SpanGeometry): Selection;
    protected _hit_rect(geometry: RectGeometry): Selection;
    protected _hit_poly(geometry: PolyGeometry): Selection;
    draw_legend_for_index(ctx: Context2d, { x0, y0, x1, y1 }: Rect, index: number): void;
}
export declare namespace Circle {
    type Attrs = p.AttrsOf<Props>;
    type Props = XYGlyph.Props & {
        angle: p.AngleSpec;
        size: p.DistanceSpec;
        radius: p.DistanceSpec;
        radius_dimension: p.Property<RadiusDimension>;
    } & Mixins;
    type Mixins = LineVector & FillVector;
    type Visuals = XYGlyph.Visuals & {
        line: Line;
        fill: Fill;
    };
}
export interface Circle extends Circle.Attrs {
}
export declare class Circle extends XYGlyph {
    properties: Circle.Props;
    __view_type__: CircleView;
    constructor(attrs?: Partial<Circle.Attrs>);
    static init_Circle(): void;
}
