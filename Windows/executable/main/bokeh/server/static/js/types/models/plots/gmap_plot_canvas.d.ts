import { Context2d } from "../../core/util/canvas";
import { GMapPlot } from "./gmap_plot";
import { PlotView, RangeInfo } from "./plot_canvas";
import { FrameBox } from "../canvas/canvas";
declare global {
    interface Window {
        _bokeh_gmaps_callback: () => void;
    }
}
export declare class GMapPlotView extends PlotView {
    model: GMapPlot;
    protected _tiles_loaded: boolean;
    protected zoom_count: number;
    protected initial_zoom: number;
    protected initial_lat: number;
    protected initial_lng: number;
    protected map_el: HTMLElement;
    private map;
    protected map_types: any;
    initialize(): void;
    remove(): void;
    update_range(range_info: RangeInfo & {
        sdx?: number;
        sdy?: number;
        factor?: number;
    } | null): void;
    protected _build_map(): void;
    protected _render_finished(): void;
    has_finished(): boolean;
    protected _get_latlon_bounds(): [number, number, number, number];
    protected _get_projected_bounds(): [number, number, number, number];
    protected _set_bokeh_ranges(): void;
    protected _update_center(fld: "lat" | "lng"): void;
    protected _update_map_type(): void;
    protected _update_scale_control(): void;
    protected _update_tilt(): void;
    protected _update_options(): void;
    protected _update_styles(): void;
    protected _update_zoom(): void;
    protected _map_hook(_ctx: Context2d, frame_box: FrameBox): void;
    protected _paint_empty(ctx: Context2d, frame_box: FrameBox): void;
}
