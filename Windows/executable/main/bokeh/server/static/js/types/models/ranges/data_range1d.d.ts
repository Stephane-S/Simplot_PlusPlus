import { DataRange } from "./data_range";
import { Renderer } from "../renderers/renderer";
import { PaddingUnits, StartEnd } from "../../core/enums";
import { Rect } from "../../core/types";
import * as p from "../../core/properties";
import type { Plot } from "../plots/plot";
export declare type Dim = 0 | 1;
export declare type Bounds = Map<Renderer, Rect>;
export declare namespace DataRange1d {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataRange.Props & {
        start: p.Property<number>;
        end: p.Property<number>;
        range_padding: p.Property<number>;
        range_padding_units: p.Property<PaddingUnits>;
        flipped: p.Property<boolean>;
        follow: p.Property<StartEnd>;
        follow_interval: p.Property<number>;
        default_span: p.Property<number>;
        only_visible: p.Property<boolean>;
        scale_hint: p.Property<"log" | "auto">;
    };
}
export interface DataRange1d extends DataRange1d.Attrs {
}
export declare class DataRange1d extends DataRange {
    properties: DataRange1d.Props;
    constructor(attrs?: Partial<DataRange1d.Attrs>);
    static init_DataRange1d(): void;
    protected _initial_start: number;
    protected _initial_end: number;
    protected _initial_range_padding: number;
    protected _initial_range_padding_units: PaddingUnits;
    protected _initial_follow: StartEnd;
    protected _initial_follow_interval: number;
    protected _initial_default_span: number;
    protected _plot_bounds: Map<Plot, Rect>;
    have_updated_interactively: boolean;
    initialize(): void;
    get min(): number;
    get max(): number;
    computed_renderers(): Renderer[];
    _compute_plot_bounds(renderers: Renderer[], bounds: Bounds): Rect;
    adjust_bounds_for_aspect(bounds: Rect, ratio: number): Rect;
    _compute_min_max(plot_bounds: Iterable<Rect>, dimension: Dim): [number, number];
    _compute_range(min: number, max: number): [number, number];
    update(bounds: Bounds, dimension: Dim, plot: Plot, ratio?: number): void;
    reset(): void;
}
