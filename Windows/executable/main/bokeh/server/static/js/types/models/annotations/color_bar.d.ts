import { Annotation, AnnotationView } from "./annotation";
import { ContinuousTicker } from "../tickers/continuous_ticker";
import { TickFormatter } from "../formatters/tick_formatter";
import { ContinuousColorMapper } from "../mappers/continuous_color_mapper";
import { Scale } from "../scales/scale";
import { Arrayable } from "../../core/types";
import { LegendLocation, Orientation } from "../../core/enums";
import * as visuals from "../../core/visuals";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
import { Size } from "../../core/layout";
export declare type Coords = [Arrayable<number>, Arrayable<number>];
export declare type TickInfo = {
    coords: {
        major: Coords;
        minor: Coords;
    };
    labels: {
        major: string[];
    };
};
export declare class ColorBarView extends AnnotationView {
    model: ColorBar;
    visuals: ColorBar.Visuals;
    protected image: HTMLCanvasElement;
    initialize(): void;
    connect_signals(): void;
    protected _get_size(): Size;
    protected _set_canvas_image(): void;
    compute_legend_dimensions(): {
        width: number;
        height: number;
    };
    compute_legend_location(): {
        sx: number;
        sy: number;
    };
    protected _render(): void;
    protected _draw_bbox(ctx: Context2d): void;
    protected _draw_image(ctx: Context2d): void;
    protected _draw_major_ticks(ctx: Context2d, tick_info: TickInfo): void;
    protected _draw_minor_ticks(ctx: Context2d, tick_info: TickInfo): void;
    protected _draw_major_labels(ctx: Context2d, tick_info: TickInfo): void;
    protected _draw_title(ctx: Context2d): void;
    _get_label_extent(): number;
    _get_image_offset(): {
        x: number;
        y: number;
    };
    _normals(): [number, number];
    _title_extent(): number;
    _tick_extent(): number;
    _computed_image_dimensions(): {
        height: number;
        width: number;
    };
    _tick_coordinate_scale(scale_length: number): Scale;
    protected _format_major_labels(initial_labels: number[], major_ticks: Arrayable<number>): string[];
    tick_info(): TickInfo;
}
export declare namespace ColorBar {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        location: p.Property<LegendLocation | [number, number]>;
        orientation: p.Property<Orientation>;
        title: p.Property<string>;
        title_standoff: p.Property<number>;
        width: p.Property<number | "auto">;
        height: p.Property<number | "auto">;
        scale_alpha: p.Property<number>;
        ticker: p.Property<ContinuousTicker>;
        formatter: p.Property<TickFormatter>;
        major_label_overrides: p.Property<{
            [key: string]: string;
        }>;
        color_mapper: p.Property<ContinuousColorMapper>;
        label_standoff: p.Property<number>;
        margin: p.Property<number>;
        padding: p.Property<number>;
        major_tick_in: p.Property<number>;
        major_tick_out: p.Property<number>;
        minor_tick_in: p.Property<number>;
        minor_tick_out: p.Property<number>;
    } & Mixins;
    type Mixins = mixins.MajorLabelText & mixins.TitleText & mixins.MajorTickLine & mixins.MinorTickLine & mixins.BorderLine & mixins.BarLine & mixins.BackgroundFill;
    type Visuals = Annotation.Visuals & {
        major_label_text: visuals.Text;
        title_text: visuals.Text;
        major_tick_line: visuals.Line;
        minor_tick_line: visuals.Line;
        border_line: visuals.Line;
        bar_line: visuals.Line;
        background_fill: visuals.Fill;
    };
}
export interface ColorBar extends ColorBar.Attrs {
}
export declare class ColorBar extends Annotation {
    properties: ColorBar.Props;
    __view_type__: ColorBarView;
    constructor(attrs?: Partial<ColorBar.Attrs>);
    static init_ColorBar(): void;
}
