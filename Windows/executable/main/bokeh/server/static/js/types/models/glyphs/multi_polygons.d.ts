import { SpatialIndex } from "../../core/util/spatial";
import { Glyph, GlyphView, GlyphData } from "./glyph";
import { Rect, NumberArray, Indices } from "../../core/types";
import { PointGeometry, RectGeometry } from "../../core/geometry";
import { Context2d } from "../../core/util/canvas";
import { LineVector, FillVector, HatchVector } from "../../core/property_mixins";
import { Line, Fill, Hatch } from "../../core/visuals";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
export interface MultiPolygonsData extends GlyphData {
    _xs: NumberArray[][][];
    _ys: NumberArray[][][];
    sxs: NumberArray[][][];
    sys: NumberArray[][][];
}
export interface MultiPolygonsView extends MultiPolygonsData {
}
export declare class MultiPolygonsView extends GlyphView {
    model: MultiPolygons;
    visuals: MultiPolygons.Visuals;
    protected _hole_index: SpatialIndex;
    protected _project_data(): void;
    protected _index_data(index: SpatialIndex): void;
    protected _index_hole_data(): SpatialIndex;
    protected _mask_data(): Indices;
    protected _inner_loop(ctx: Context2d, sx: NumberArray[][], sy: NumberArray[][]): void;
    protected _render(ctx: Context2d, indices: number[], { sxs, sys }: MultiPolygonsData): void;
    protected _hit_rect(geometry: RectGeometry): Selection;
    protected _hit_point(geometry: PointGeometry): Selection;
    private _get_snap_coord;
    scenterxy(i: number, sx: number, sy: number): [number, number];
    map_data(): void;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
}
export declare namespace MultiPolygons {
    type Attrs = p.AttrsOf<Props>;
    type Props = Glyph.Props & {
        xs: p.CoordinateSeqSeqSeqSpec;
        ys: p.CoordinateSeqSeqSeqSpec;
    } & Mixins;
    type Mixins = LineVector & FillVector & HatchVector;
    type Visuals = Glyph.Visuals & {
        line: Line;
        fill: Fill;
        hatch: Hatch;
    };
}
export interface MultiPolygons extends MultiPolygons.Attrs {
}
export declare class MultiPolygons extends Glyph {
    properties: MultiPolygons.Props;
    __view_type__: MultiPolygonsView;
    constructor(attrs?: Partial<MultiPolygons.Attrs>);
    static init_MultiPolygons(): void;
}
