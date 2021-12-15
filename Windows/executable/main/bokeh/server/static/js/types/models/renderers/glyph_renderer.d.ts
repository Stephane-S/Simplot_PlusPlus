import { DataRenderer, DataRendererView } from "./data_renderer";
import { Glyph, GlyphView } from "../glyphs/glyph";
import { ColumnarDataSource } from "../sources/columnar_data_source";
import { CDSView } from "../sources/cds_view";
import { Indices } from "../../core/types";
import * as p from "../../core/properties";
import { HitTestResult } from "../../core/hittest";
import { Geometry } from "../../core/geometry";
import { SelectionManager } from "../../core/selection_manager";
import { Context2d } from "../../core/util/canvas";
export declare class GlyphRendererView extends DataRendererView {
    model: GlyphRenderer;
    glyph: GlyphView;
    selection_glyph: GlyphView;
    nonselection_glyph: GlyphView;
    hover_glyph?: GlyphView;
    muted_glyph?: GlyphView;
    decimated_glyph: GlyphView;
    protected all_indices: Indices;
    protected decimated: Indices;
    set_data_timestamp: number;
    protected last_dtrender: number;
    lazy_initialize(): Promise<void>;
    build_glyph_view<T extends Glyph>(glyph: T): Promise<GlyphView>;
    remove(): void;
    connect_signals(): void;
    _update_masked_indices(): Indices;
    set_data(request_render?: boolean, indices?: number[] | null): void;
    set_visuals(): void;
    get has_webgl(): boolean;
    protected _render(): void;
    draw_legend(ctx: Context2d, x0: number, x1: number, y0: number, y1: number, field: string | null, label: string, index: number | null): void;
    hit_test(geometry: Geometry): HitTestResult;
}
export declare namespace GlyphRenderer {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataRenderer.Props & {
        data_source: p.Property<ColumnarDataSource>;
        view: p.Property<CDSView>;
        glyph: p.Property<Glyph>;
        hover_glyph: p.Property<Glyph>;
        nonselection_glyph: p.Property<Glyph | "auto">;
        selection_glyph: p.Property<Glyph | "auto">;
        muted_glyph: p.Property<Glyph>;
        muted: p.Property<boolean>;
    };
}
export interface GlyphRenderer extends GlyphRenderer.Attrs {
}
export declare class GlyphRenderer extends DataRenderer {
    properties: GlyphRenderer.Props;
    __view_type__: GlyphRendererView;
    constructor(attrs?: Partial<GlyphRenderer.Attrs>);
    static init_GlyphRenderer(): void;
    initialize(): void;
    get_reference_point(field: string | null, value?: any): number;
    get_selection_manager(): SelectionManager;
}
