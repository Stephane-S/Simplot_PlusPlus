import { Mapper } from "./mapper";
import * as p from "../../core/properties";
import { isNumber } from "../../core/util/types";
import { color2hex } from "../../core/util/color";
import { is_little_endian } from "../../core/util/compat";
export function _convert_color(color) {
    if (isNumber(color))
        return color;
    if (color[0] != "#")
        color = color2hex(color);
    if (color.length != 9)
        color = color + 'ff';
    return parseInt(color.slice(1), 16);
}
export function _convert_palette(palette) {
    const new_palette = new Uint32Array(palette.length);
    for (let i = 0, end = palette.length; i < end; i++)
        new_palette[i] = _convert_color(palette[i]);
    return new_palette;
}
export function _uint32_to_rgba(values) {
    if (is_little_endian) {
        const view = new DataView(values.buffer);
        for (let i = 0, end = values.length; i < end; i++)
            view.setUint32(i * 4, values[i]);
    }
    return new Uint8Array(values.buffer);
}
export class ColorMapper extends Mapper {
    constructor(attrs) {
        super(attrs);
    }
    static init_ColorMapper() {
        this.define({
            palette: [p.Any],
            nan_color: [p.Color, "gray"],
        });
    }
    v_compute(xs) {
        const values = new Array(xs.length);
        this._v_compute(xs, values, this.palette, this._colors((c) => c));
        return values;
    }
    get rgba_mapper() {
        const self = this;
        const palette = _convert_palette(this.palette);
        const colors = this._colors(_convert_color);
        return {
            v_compute(xs) {
                const values = new Uint32Array(xs.length);
                self._v_compute(xs, values, palette, colors);
                return _uint32_to_rgba(values);
            },
        };
    }
    _colors(conv) {
        return { nan_color: conv(this.nan_color) };
    }
}
ColorMapper.__name__ = "ColorMapper";
ColorMapper.init_ColorMapper();
//# sourceMappingURL=color_mapper.js.map