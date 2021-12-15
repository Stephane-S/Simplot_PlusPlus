import * as p from "./properties";
import { Color } from "./types";
import { LineJoin, LineCap, FontStyle, HatchPatternType, TextAlign, TextBaseline } from "./enums";
import { Texture } from "../models/textures/texture";
export declare type HatchPattern = HatchPatternType | string;
export declare type HatchExtra = {
    [key: string]: Texture;
};
export declare type Line = {
    line_color: p.Property<Color | null>;
    line_alpha: p.Property<number>;
    line_width: p.Property<number>;
    line_join: p.Property<LineJoin>;
    line_cap: p.Property<LineCap>;
    line_dash: p.Property<number[]>;
    line_dash_offset: p.Property<number>;
};
export declare type Fill = {
    fill_color: p.Property<Color | null>;
    fill_alpha: p.Property<number>;
};
export declare type Hatch = {
    hatch_color: p.Property<Color | null>;
    hatch_alpha: p.Property<number>;
    hatch_scale: p.Property<number>;
    hatch_pattern: p.Property<HatchPattern | null>;
    hatch_weight: p.Property<number>;
    hatch_extra: p.Property<HatchExtra>;
};
export declare type Text = {
    text_color: p.Property<Color | null>;
    text_alpha: p.Property<number>;
    text_font: p.Property<string>;
    text_font_size: p.Property<string>;
    text_font_style: p.Property<FontStyle>;
    text_align: p.Property<TextAlign>;
    text_baseline: p.Property<TextBaseline>;
    text_line_height: p.Property<number>;
};
export declare const Line: p.DefineOf<Line>;
export declare const Fill: p.DefineOf<Fill>;
export declare const Hatch: p.DefineOf<Hatch>;
export declare const Text: p.DefineOf<Text>;
export declare type LineScalar = {
    line_color: p.ScalarSpec<Color | null>;
    line_alpha: p.ScalarSpec<number>;
    line_width: p.ScalarSpec<number>;
    line_join: p.ScalarSpec<LineJoin>;
    line_cap: p.ScalarSpec<LineCap>;
    line_dash: p.ScalarSpec<number[]>;
    line_dash_offset: p.ScalarSpec<number>;
};
export declare type FillScalar = {
    fill_color: p.ScalarSpec<Color | null>;
    fill_alpha: p.ScalarSpec<number>;
};
export declare type HatchScalar = {
    hatch_color: p.ScalarSpec<Color | null>;
    hatch_alpha: p.ScalarSpec<number>;
    hatch_scale: p.ScalarSpec<number>;
    hatch_pattern: p.ScalarSpec<string | null>;
    hatch_weight: p.ScalarSpec<number>;
    hatch_extra: p.ScalarSpec<HatchExtra>;
};
export declare type TextScalar = {
    text_color: p.ScalarSpec<Color | null>;
    text_alpha: p.ScalarSpec<number>;
    text_font: p.ScalarSpec<string>;
    text_font_size: p.ScalarSpec<string>;
    text_font_style: p.ScalarSpec<FontStyle>;
    text_align: p.ScalarSpec<TextAlign>;
    text_baseline: p.ScalarSpec<TextBaseline>;
    text_line_height: p.ScalarSpec<number>;
};
export declare const LineScalar: p.DefineOf<LineScalar>;
export declare const FillScalar: p.DefineOf<FillScalar>;
export declare const HatchScalar: p.DefineOf<HatchScalar>;
export declare const TextScalar: p.DefineOf<TextScalar>;
export declare type LineVector = {
    line_color: p.VectorSpec<Color | null>;
    line_alpha: p.VectorSpec<number>;
    line_width: p.VectorSpec<number>;
    line_join: p.Property<LineJoin>;
    line_cap: p.Property<LineCap>;
    line_dash: p.Property<number[]>;
    line_dash_offset: p.Property<number>;
};
export declare type FillVector = {
    fill_color: p.VectorSpec<Color | null>;
    fill_alpha: p.VectorSpec<number>;
};
export declare type HatchVector = {
    hatch_color: p.VectorSpec<Color | null>;
    hatch_alpha: p.VectorSpec<number>;
    hatch_scale: p.VectorSpec<number>;
    hatch_pattern: p.VectorSpec<HatchPattern | null>;
    hatch_weight: p.VectorSpec<number>;
    hatch_extra: p.Property<HatchExtra>;
};
export declare type TextVector = {
    text_color: p.VectorSpec<Color | null>;
    text_alpha: p.VectorSpec<number>;
    text_font: p.Property<string>;
    text_font_size: p.VectorSpec<string>;
    text_font_style: p.Property<FontStyle>;
    text_align: p.Property<TextAlign>;
    text_baseline: p.Property<TextBaseline>;
    text_line_height: p.Property<number>;
};
export declare const LineVector: p.DefineOf<LineVector>;
export declare const FillVector: p.DefineOf<FillVector>;
export declare const HatchVector: p.DefineOf<HatchVector>;
export declare const TextVector: p.DefineOf<TextVector>;
export declare type LabelText = {
    label_text_color: Text["text_color"];
    label_text_alpha: Text["text_alpha"];
    label_text_font: Text["text_font"];
    label_text_font_size: Text["text_font_size"];
    label_text_font_style: Text["text_font_style"];
    label_text_align: Text["text_align"];
    label_text_baseline: Text["text_baseline"];
    label_text_line_height: Text["text_line_height"];
};
export declare type InactiveFill = {
    inactive_fill_color: Fill["fill_color"];
    inactive_fill_alpha: Fill["fill_alpha"];
};
export declare type BorderLine = {
    border_line_color: Line["line_color"];
    border_line_alpha: Line["line_alpha"];
    border_line_width: Line["line_width"];
    border_line_join: Line["line_join"];
    border_line_cap: Line["line_cap"];
    border_line_dash: Line["line_dash"];
    border_line_dash_offset: Line["line_dash_offset"];
};
export declare type BackgroundFill = {
    background_fill_color: Fill["fill_color"];
    background_fill_alpha: Fill["fill_alpha"];
};
export declare type MajorLabelText = {
    major_label_text_color: Text["text_color"];
    major_label_text_alpha: Text["text_alpha"];
    major_label_text_font: Text["text_font"];
    major_label_text_font_size: Text["text_font_size"];
    major_label_text_font_style: Text["text_font_style"];
    major_label_text_align: Text["text_align"];
    major_label_text_baseline: Text["text_baseline"];
    major_label_text_line_height: Text["text_line_height"];
};
export declare type TitleText = {
    title_text_color: Text["text_color"];
    title_text_alpha: Text["text_alpha"];
    title_text_font: Text["text_font"];
    title_text_font_size: Text["text_font_size"];
    title_text_font_style: Text["text_font_style"];
    title_text_align: Text["text_align"];
    title_text_baseline: Text["text_baseline"];
    title_text_line_height: Text["text_line_height"];
};
export declare type MajorTickLine = {
    major_tick_line_color: Line["line_color"];
    major_tick_line_alpha: Line["line_alpha"];
    major_tick_line_width: Line["line_width"];
    major_tick_line_join: Line["line_join"];
    major_tick_line_cap: Line["line_cap"];
    major_tick_line_dash: Line["line_dash"];
    major_tick_line_dash_offset: Line["line_dash_offset"];
};
export declare type MinorTickLine = {
    minor_tick_line_color: Line["line_color"];
    minor_tick_line_alpha: Line["line_alpha"];
    minor_tick_line_width: Line["line_width"];
    minor_tick_line_join: Line["line_join"];
    minor_tick_line_cap: Line["line_cap"];
    minor_tick_line_dash: Line["line_dash"];
    minor_tick_line_dash_offset: Line["line_dash_offset"];
};
export declare type BarLine = {
    bar_line_color: Line["line_color"];
    bar_line_alpha: Line["line_alpha"];
    bar_line_width: Line["line_width"];
    bar_line_join: Line["line_join"];
    bar_line_cap: Line["line_cap"];
    bar_line_dash: Line["line_dash"];
    bar_line_dash_offset: Line["line_dash_offset"];
};
export declare type AxisLine = {
    axis_line_color: Line["line_color"];
    axis_line_alpha: Line["line_alpha"];
    axis_line_width: Line["line_width"];
    axis_line_join: Line["line_join"];
    axis_line_cap: Line["line_cap"];
    axis_line_dash: Line["line_dash"];
    axis_line_dash_offset: Line["line_dash_offset"];
};
export declare type AxisLabelText = {
    axis_label_text_color: Text["text_color"];
    axis_label_text_alpha: Text["text_alpha"];
    axis_label_text_font: Text["text_font"];
    axis_label_text_font_size: Text["text_font_size"];
    axis_label_text_font_style: Text["text_font_style"];
    axis_label_text_align: Text["text_align"];
    axis_label_text_baseline: Text["text_baseline"];
    axis_label_text_line_height: Text["text_line_height"];
};
export declare type GridLine = {
    grid_line_color: Line["line_color"];
    grid_line_alpha: Line["line_alpha"];
    grid_line_width: Line["line_width"];
    grid_line_join: Line["line_join"];
    grid_line_cap: Line["line_cap"];
    grid_line_dash: Line["line_dash"];
    grid_line_dash_offset: Line["line_dash_offset"];
};
export declare type MinorGridLine = {
    minor_grid_line_color: Line["line_color"];
    minor_grid_line_alpha: Line["line_alpha"];
    minor_grid_line_width: Line["line_width"];
    minor_grid_line_join: Line["line_join"];
    minor_grid_line_cap: Line["line_cap"];
    minor_grid_line_dash: Line["line_dash"];
    minor_grid_line_dash_offset: Line["line_dash_offset"];
};
export declare type BandFill = {
    band_fill_color: Fill["fill_color"];
    band_fill_alpha: Fill["fill_alpha"];
};
export declare type BandHatch = {
    band_hatch_color: Hatch["hatch_color"];
    band_hatch_alpha: Hatch["hatch_alpha"];
    band_hatch_scale: Hatch["hatch_scale"];
    band_hatch_pattern: Hatch["hatch_pattern"];
    band_hatch_weight: Hatch["hatch_weight"];
    band_hatch_extra: Hatch["hatch_extra"];
};
export declare type OutlineLine = {
    outline_line_color: Line["line_color"];
    outline_line_alpha: Line["line_alpha"];
    outline_line_width: Line["line_width"];
    outline_line_join: Line["line_join"];
    outline_line_cap: Line["line_cap"];
    outline_line_dash: Line["line_dash"];
    outline_line_dash_offset: Line["line_dash_offset"];
};
export declare type BorderFill = {
    border_fill_color: Fill["fill_color"];
    border_fill_alpha: Fill["fill_alpha"];
};
export declare type SeparatorLine = {
    separator_line_color: Line["line_color"];
    separator_line_alpha: Line["line_alpha"];
    separator_line_width: Line["line_width"];
    separator_line_join: Line["line_join"];
    separator_line_cap: Line["line_cap"];
    separator_line_dash: Line["line_dash"];
    separator_line_dash_offset: Line["line_dash_offset"];
};
export declare type GroupText = {
    group_text_color: Text["text_color"];
    group_text_alpha: Text["text_alpha"];
    group_text_font: Text["text_font"];
    group_text_font_size: Text["text_font_size"];
    group_text_font_style: Text["text_font_style"];
    group_text_align: Text["text_align"];
    group_text_baseline: Text["text_baseline"];
    group_text_line_height: Text["text_line_height"];
};
export declare type SubGroupText = {
    subgroup_text_color: Text["text_color"];
    subgroup_text_alpha: Text["text_alpha"];
    subgroup_text_font: Text["text_font"];
    subgroup_text_font_size: Text["text_font_size"];
    subgroup_text_font_style: Text["text_font_style"];
    subgroup_text_align: Text["text_align"];
    subgroup_text_baseline: Text["text_baseline"];
    subgroup_text_line_height: Text["text_line_height"];
};
