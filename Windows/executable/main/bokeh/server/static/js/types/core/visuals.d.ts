import * as mixins from "./property_mixins";
import * as p from "./properties";
import { Context2d } from "./util/canvas";
import { Arrayable, Indices } from "./types";
import { LineJoin, LineCap, FontStyle, TextAlign, TextBaseline } from "./enums";
import { HasProps } from "./has_props";
import { ColumnarDataSource } from "../models/sources/columnar_data_source";
export declare const hatch_aliases: {
    [key: string]: mixins.HatchPattern;
};
export declare abstract class ContextProperties {
    readonly obj: HasProps;
    readonly prefix: string;
    /** @prototype */
    attrs: string[];
    readonly cache: {
        [key: string]: any;
    };
    abstract get doit(): boolean;
    constructor(obj: HasProps, prefix?: string);
    warm_cache(source?: ColumnarDataSource, all_indices?: Indices): void;
    cache_select(attr: string, i: number): any;
    get_array(attr: string): Arrayable;
    set_vectorize(ctx: Context2d, i: number): void;
    protected abstract _set_vectorize(ctx: Context2d, i: number): void;
}
export declare class Line extends ContextProperties {
    readonly line_color: p.ColorSpec;
    readonly line_width: p.NumberSpec;
    readonly line_alpha: p.NumberSpec;
    readonly line_join: p.Property<LineJoin>;
    readonly line_cap: p.Property<LineCap>;
    readonly line_dash: p.Array;
    readonly line_dash_offset: p.Number;
    set_value(ctx: Context2d): void;
    get doit(): boolean;
    protected _set_vectorize(ctx: Context2d, i: number): void;
    color_value(): string;
}
export declare class Fill extends ContextProperties {
    readonly fill_color: p.ColorSpec;
    readonly fill_alpha: p.NumberSpec;
    set_value(ctx: Context2d): void;
    get doit(): boolean;
    protected _set_vectorize(ctx: Context2d, i: number): void;
    color_value(): string;
}
export declare class Hatch extends ContextProperties {
    readonly hatch_color: p.ColorSpec;
    readonly hatch_alpha: p.NumberSpec;
    readonly hatch_scale: p.NumberSpec;
    readonly hatch_pattern: p.StringSpec;
    readonly hatch_weight: p.NumberSpec;
    cache_select(name: string, i: number): any;
    private _try_defer;
    get doit(): boolean;
    doit2(ctx: Context2d, i: number, ready_func: () => void, defer_func: () => void): void;
    protected _set_vectorize(ctx: Context2d, i: number): void;
    color_value(): string;
}
export declare class Text extends ContextProperties {
    readonly text_font: p.Font;
    readonly text_font_size: p.StringSpec;
    readonly text_font_style: p.Property<FontStyle>;
    readonly text_color: p.ColorSpec;
    readonly text_alpha: p.NumberSpec;
    readonly text_align: p.Property<TextAlign>;
    readonly text_baseline: p.Property<TextBaseline>;
    readonly text_line_height: p.Number;
    color_value(): string;
    font_value(): string;
    v_font_value(i: number): string;
    cache_select(name: string, i: number): any;
    set_value(ctx: Context2d): void;
    get doit(): boolean;
    protected _set_vectorize(ctx: Context2d, i: number): void;
}
export declare class Visuals {
    constructor(model: HasProps);
    warm_cache(source?: ColumnarDataSource, all_indices?: Indices): void;
}
