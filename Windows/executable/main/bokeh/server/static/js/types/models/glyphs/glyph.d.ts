import { HitTestResult } from "../../core/hittest";
import * as p from "../../core/properties";
import * as visuals from "../../core/visuals";
import * as geometry from "../../core/geometry";
import { Context2d } from "../../core/util/canvas";
import { View } from "../../core/view";
import { Model } from "../../model";
import { Anchor } from "../../core/enums";
import { Arrayable, Rect, NumberArray, Indices } from "../../core/types";
import { SpatialIndex } from "../../core/util/spatial";
import { Scale } from "../scales/scale";
import { Selection } from "../selections/selection";
import { GlyphRendererView } from "../renderers/glyph_renderer";
import { ColumnarDataSource } from "../sources/columnar_data_source";
export interface GlyphData {
}
export interface GlyphView extends GlyphData {
}
export declare abstract class GlyphView extends View {
    model: Glyph;
    visuals: Glyph.Visuals;
    parent: GlyphRendererView;
    get renderer(): GlyphRendererView;
    get has_webgl(): boolean;
    private _index;
    private _data_size;
    protected _nohit_warned: Set<geometry.Geometry["type"]>;
    get index(): SpatialIndex;
    get data_size(): number;
    initialize(): void;
    set_visuals(source: ColumnarDataSource, indices: Indices): void;
    render(ctx: Context2d, indices: number[], data: any): void;
    protected abstract _render(ctx: Context2d, indices: number[], data: any): void;
    has_finished(): boolean;
    notify_finished(): void;
    protected _bounds(bounds: Rect): Rect;
    bounds(): Rect;
    log_bounds(): Rect;
    get_anchor_point(anchor: Anchor, i: number, [sx, sy]: [number, number]): {
        x: number;
        y: number;
    } | null;
    abstract scenterxy(i: number, sx: number, sy: number): [number, number];
    /** @deprecated */
    scenterx(i: number, sx: number, sy: number): number;
    /** @deprecated */
    scentery(i: number, sx: number, sy: number): number;
    sdist(scale: Scale, pts: Arrayable<number>, spans: Arrayable<number>, pts_location?: "center" | "edge", dilate?: boolean): NumberArray;
    draw_legend_for_index(_ctx: Context2d, _bbox: Rect, _index: number): void;
    protected _hit_point?(geometry: geometry.PointGeometry): Selection;
    protected _hit_span?(geometry: geometry.SpanGeometry): Selection;
    protected _hit_rect?(geometry: geometry.RectGeometry): Selection;
    protected _hit_poly?(geometry: geometry.PolyGeometry): Selection;
    hit_test(geometry: geometry.Geometry): HitTestResult;
    protected _hit_rect_against_index(geometry: geometry.RectGeometry): Selection;
    protected _project_data(): void;
    set_data(source: ColumnarDataSource, indices: Indices, indices_to_update: number[] | null): void;
    protected _set_data(_indices: number[] | null): void;
    protected get _index_size(): number;
    protected abstract _index_data(index: SpatialIndex): void;
    index_data(): void;
    mask_data(): Indices;
    protected _mask_data?(): Indices;
    map_data(): void;
    protected _map_data(): void;
}
export declare namespace Glyph {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
    type Visuals = visuals.Visuals;
}
export interface Glyph extends Glyph.Attrs {
}
export declare abstract class Glyph extends Model {
    properties: Glyph.Props;
    __view_type__: GlyphView;
    constructor(attrs?: Partial<Glyph.Attrs>);
    static init_Glyph(): void;
}
