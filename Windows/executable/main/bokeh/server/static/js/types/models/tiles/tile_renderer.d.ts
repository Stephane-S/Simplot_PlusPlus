import { Tile } from "./tile_source";
import { Extent, Bounds } from "./tile_utils";
import { TileSource } from "./tile_source";
import { DataRenderer, DataRendererView } from "../renderers/data_renderer";
import * as p from "../../core/properties";
import { Image } from "../../core/util/image";
import { SelectionManager } from "../../core/selection_manager";
export declare type TileData = Tile & ({
    img: Image;
    loaded: true;
} | {
    img: undefined;
    loaded: false;
}) & {
    normalized_coords: [number, number, number];
    quadkey: string;
    cache_key: string;
    bounds: Bounds;
    finished: boolean;
    x_coord: number;
    y_coord: number;
};
export declare class TileRendererView extends DataRendererView {
    model: TileRenderer;
    protected attribution_el?: HTMLElement;
    protected _tiles: TileData[];
    protected extent: Extent;
    protected initial_extent: Extent;
    protected _last_height?: number;
    protected _last_width?: number;
    protected map_initialized?: boolean;
    protected render_timer?: number;
    protected prefetch_timer?: number;
    initialize(): void;
    connect_signals(): void;
    styles(): string[];
    get_extent(): Extent;
    private get map_plot();
    private get map_canvas();
    private get map_frame();
    private get x_range();
    private get y_range();
    protected _set_data(): void;
    protected _update_attribution(): void;
    protected _map_data(): void;
    protected _create_tile(x: number, y: number, z: number, bounds: Bounds, cache_only?: boolean): void;
    protected _enforce_aspect_ratio(): void;
    has_finished(): boolean;
    protected _render(): void;
    _draw_tile(tile_key: string): void;
    protected _set_rect(): void;
    protected _render_tiles(tile_keys: string[]): void;
    protected _prefetch_tiles(): void;
    protected _fetch_tiles(tiles: [number, number, number, Bounds][]): void;
    protected _update(): void;
}
export declare namespace TileRenderer {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataRenderer.Props & {
        alpha: p.Property<number>;
        smoothing: p.Property<boolean>;
        tile_source: p.Property<TileSource>;
        render_parents: p.Property<boolean>;
    };
}
export interface TileRenderer extends TileRenderer.Attrs {
}
export declare class TileRenderer extends DataRenderer {
    properties: TileRenderer.Props;
    __view_type__: TileRendererView;
    constructor(attrs?: Partial<TileRenderer.Attrs>);
    static init_TileRenderer(): void;
    private _selection_manager;
    get_selection_manager(): SelectionManager;
}
