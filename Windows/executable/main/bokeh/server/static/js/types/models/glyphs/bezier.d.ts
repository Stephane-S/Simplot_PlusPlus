import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { Rect, NumberArray } from "../../core/types";
import { SpatialIndex } from "../../core/util/spatial";
import { Context2d } from "../../core/util/canvas";
import { Glyph, GlyphView, GlyphData } from "./glyph";
import * as p from "../../core/properties";
export interface BezierData extends GlyphData {
    _x0: NumberArray;
    _y0: NumberArray;
    _x1: NumberArray;
    _y1: NumberArray;
    _cx0: NumberArray;
    _cy0: NumberArray;
    _cx1: NumberArray;
    _cy1: NumberArray;
    sx0: NumberArray;
    sy0: NumberArray;
    sx1: NumberArray;
    sy1: NumberArray;
    scx0: NumberArray;
    scy0: NumberArray;
    scx1: NumberArray;
    scy1: NumberArray;
}
export interface BezierView extends BezierData {
}
export declare class BezierView extends GlyphView {
    model: Bezier;
    visuals: Bezier.Visuals;
    protected _project_data(): void;
    protected _index_data(index: SpatialIndex): void;
    protected _render(ctx: Context2d, indices: number[], { sx0, sy0, sx1, sy1, scx0, scy0, scx1, scy1 }: BezierData): void;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
    scenterxy(): [number, number];
}
export declare namespace Bezier {
    type Attrs = p.AttrsOf<Props>;
    type Props = Glyph.Props & {
        x0: p.CoordinateSpec;
        y0: p.CoordinateSpec;
        x1: p.CoordinateSpec;
        y1: p.CoordinateSpec;
        cx0: p.CoordinateSpec;
        cy0: p.CoordinateSpec;
        cx1: p.CoordinateSpec;
        cy1: p.CoordinateSpec;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = Glyph.Visuals & {
        line: Line;
    };
}
export interface Bezier extends Bezier.Attrs {
}
export declare class Bezier extends Glyph {
    properties: Bezier.Props;
    __view_type__: BezierView;
    constructor(attrs?: Partial<Bezier.Attrs>);
    static init_Bezier(): void;
}
