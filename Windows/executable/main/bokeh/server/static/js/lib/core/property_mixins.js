import * as p from "./properties";
export const Line = {
    line_color: [p.Color, "black"],
    line_alpha: [p.Number, 1.0],
    line_width: [p.Number, 1],
    line_join: [p.LineJoin, "bevel"],
    line_cap: [p.LineCap, "butt"],
    line_dash: [p.Array, []],
    line_dash_offset: [p.Number, 0],
};
export const Fill = {
    fill_color: [p.Color, "gray"],
    fill_alpha: [p.Number, 1.0],
};
export const Hatch = {
    hatch_color: [p.Color, "black"],
    hatch_alpha: [p.Number, 1.0],
    hatch_scale: [p.Number, 12.0],
    hatch_pattern: [p.NullString, null],
    hatch_weight: [p.Number, 1.0],
    hatch_extra: [p.Any, {}],
};
export const Text = {
    text_color: [p.Color, "#444444"],
    text_alpha: [p.Number, 1.0],
    text_font: [p.Font, "helvetica"],
    text_font_size: [p.FontSize, "16px"],
    text_font_style: [p.FontStyle, "normal"],
    text_align: [p.TextAlign, "left"],
    text_baseline: [p.TextBaseline, "bottom"],
    text_line_height: [p.Number, 1.2],
};
export const LineScalar = {
    line_color: [p.ColorScalar, "black"],
    line_alpha: [p.NumberScalar, 1.0],
    line_width: [p.NumberScalar, 1],
    line_join: [p.LineJoinScalar, "bevel"],
    line_cap: [p.LineCapScalar, "butt"],
    line_dash: [p.ArrayScalar, []],
    line_dash_offset: [p.NumberScalar, 0],
};
export const FillScalar = {
    fill_color: [p.ColorScalar, "gray"],
    fill_alpha: [p.NumberScalar, 1.0],
};
export const HatchScalar = {
    hatch_color: [p.ColorScalar, "black"],
    hatch_alpha: [p.NumberScalar, 1.0],
    hatch_scale: [p.NumberScalar, 12.0],
    hatch_pattern: [p.NullStringScalar, null],
    hatch_weight: [p.NumberScalar, 1.0],
    hatch_extra: [p.AnyScalar, {}],
};
export const TextScalar = {
    text_color: [p.ColorScalar, "#444444"],
    text_alpha: [p.NumberScalar, 1.0],
    text_font: [p.Font, "helvetica"],
    text_font_size: [p.FontSizeScalar, "16px"],
    text_font_style: [p.FontStyleScalar, "normal"],
    text_align: [p.TextAlignScalar, "left"],
    text_baseline: [p.TextBaselineScalar, "bottom"],
    text_line_height: [p.NumberScalar, 1.2],
};
export const LineVector = {
    line_color: [p.ColorSpec, "black"],
    line_alpha: [p.NumberSpec, 1.0],
    line_width: [p.NumberSpec, 1],
    line_join: [p.LineJoin, "bevel"],
    line_cap: [p.LineCap, "butt"],
    line_dash: [p.Array, []],
    line_dash_offset: [p.Number, 0],
};
export const FillVector = {
    fill_color: [p.ColorSpec, "gray"],
    fill_alpha: [p.NumberSpec, 1.0],
};
export const HatchVector = {
    hatch_color: [p.ColorSpec, "black"],
    hatch_alpha: [p.NumberSpec, 1.0],
    hatch_scale: [p.NumberSpec, 12.0],
    hatch_pattern: [p.NullStringSpec, null],
    hatch_weight: [p.NumberSpec, 1.0],
    hatch_extra: [p.Any, {}],
};
export const TextVector = {
    text_color: [p.ColorSpec, "#444444"],
    text_alpha: [p.NumberSpec, 1.0],
    text_font: [p.Font, "helvetica"],
    text_font_size: [p.FontSizeSpec, "16px"],
    text_font_style: [p.FontStyle, "normal"],
    text_align: [p.TextAlign, "left"],
    text_baseline: [p.TextBaseline, "bottom"],
    text_line_height: [p.Number, 1.2],
};
//# sourceMappingURL=property_mixins.js.map