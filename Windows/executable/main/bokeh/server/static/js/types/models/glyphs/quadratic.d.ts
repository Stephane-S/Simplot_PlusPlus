import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { Rect, NumberArray } from "../../core/types";
import { SpatialIndex } from "../../core/util/spatial";
import { Context2d } from "../../core/util/canvas";
import { Glyph, GlyphView, GlyphData } from "./glyph";
import * as p from "../../core/properties";
export interface QuadraticData extends GlyphData {
    _x0: NumberArray;
    _y0: NumberArray;
    _x1: NumberArray;
    _y1: NumberArray;
    _cx: NumberArray;
    _cy: NumberArray;
    sx0: NumberArray;
    sy0: NumberArray;
    sx1: NumberArray;
    sy1: NumberArray;
    scx: NumberArray;
    scy: NumberArray;
}
export interface QuadraticView extends QuadraticData {
}
export declare class QuadraticView extends GlyphView {
    model: Quadratic;
    visuals: Quadratic.Visuals;
    protected _project_data(): void;
    protected _index_data(index: SpatialIndex): void;
    protected _render(ctx: Context2d, indices: number[], { sx0, sy0, sx1, sy1, scx, scy }: QuadraticData): void;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
    scenterxy(): [number, number];
}
export declare namespace Quadratic {
    type Attrs = p.AttrsOf<Props>;
    type Props = Glyph.Props & {
        x0: p.CoordinateSpec;
        y0: p.CoordinateSpec;
        x1: p.CoordinateSpec;
        y1: p.CoordinateSpec;
        cx: p.CoordinateSpec;
        cy: p.CoordinateSpec;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = Glyph.Visuals & {
        line: Line;
    };
}
export interface Quadratic extends Quadratic.Attrs {
}
export declare class Quadratic extends Glyph {
    properties: Quadratic.Props;
    __view_type__: QuadraticView;
    constructor(attrs?: Partial<Quadratic.Attrs>);
    static init_Quadratic(): void;
}
