import { XYGlyph, XYGlyphView, XYGlyphData } from "./xy_glyph";
import { Rect, NumberArray } from "../../core/types";
import { PointGeometry } from "../../core/geometry";
import { LineVector, FillVector } from "../../core/property_mixins";
import { Line, Fill } from "../../core/visuals";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
import { Selection } from "../selections/selection";
export interface AnnulusData extends XYGlyphData {
    _inner_radius: NumberArray;
    _outer_radius: NumberArray;
    sinner_radius: NumberArray;
    souter_radius: NumberArray;
    max_inner_radius: number;
    max_outer_radius: number;
}
export interface AnnulusView extends AnnulusData {
}
export declare class AnnulusView extends XYGlyphView {
    model: Annulus;
    visuals: Annulus.Visuals;
    protected _map_data(): void;
    protected _render(ctx: Context2d, indices: number[], { sx, sy, sinner_radius, souter_radius }: AnnulusData): void;
    protected _hit_point(geometry: PointGeometry): Selection;
    draw_legend_for_index(ctx: Context2d, { x0, y0, x1, y1 }: Rect, index: number): void;
}
export declare namespace Annulus {
    type Attrs = p.AttrsOf<Props>;
    type Props = XYGlyph.Props & {
        inner_radius: p.DistanceSpec;
        outer_radius: p.DistanceSpec;
    } & Mixins;
    type Mixins = LineVector & FillVector;
    type Visuals = XYGlyph.Visuals & {
        line: Line;
        fill: Fill;
    };
}
export interface Annulus extends Annulus.Attrs {
}
export declare class Annulus extends XYGlyph {
    properties: Annulus.Props;
    __view_type__: AnnulusView;
    constructor(attrs?: Partial<Annulus.Attrs>);
    static init_Annulus(): void;
}
