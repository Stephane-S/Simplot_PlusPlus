import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { TextVector } from "../../core/property_mixins";
import * as hittest from "../../core/hittest";
import * as p from "../../core/properties";
import { measure_font } from "../../core/util/text";
import { assert } from "../../core/util/assert";
import { Selection } from "../selections/selection";
export class TextView extends XYGlyphView {
    _rotate_point(x, y, xoff, yoff, angle) {
        const sxr = (x - xoff) * Math.cos(angle) - (y - yoff) * Math.sin(angle) + xoff;
        const syr = (x - xoff) * Math.sin(angle) + (y - yoff) * Math.cos(angle) + yoff;
        return [sxr, syr];
    }
    _text_bounds(x0, y0, width, height) {
        const xvals = [x0, x0 + width, x0 + width, x0, x0];
        const yvals = [y0, y0, y0 - height, y0 - height, y0];
        return [xvals, yvals];
    }
    _render(ctx, indices, { sx, sy, _x_offset, _y_offset, _angle, _text }) {
        this._sys = [];
        this._sxs = [];
        for (const i of indices) {
            this._sxs[i] = [];
            this._sys[i] = [];
            if (isNaN(sx[i] + sy[i] + _x_offset[i] + _y_offset[i] + _angle[i]) || _text[i] == null)
                continue;
            if (this.visuals.text.doit) {
                const text = `${_text[i]}`;
                ctx.save();
                ctx.translate(sx[i] + _x_offset[i], sy[i] + _y_offset[i]);
                ctx.rotate(_angle[i]);
                this.visuals.text.set_vectorize(ctx, i);
                const font = this.visuals.text.cache_select("font", i);
                const { height } = measure_font(font);
                const line_height = this.visuals.text.text_line_height.value() * height;
                if (text.indexOf("\n") == -1) {
                    ctx.fillText(text, 0, 0);
                    const x0 = sx[i] + _x_offset[i];
                    const y0 = sy[i] + _y_offset[i];
                    const width = ctx.measureText(text).width;
                    const [xvalues, yvalues] = this._text_bounds(x0, y0, width, line_height);
                    this._sxs[i].push(xvalues);
                    this._sys[i].push(yvalues);
                }
                else {
                    const lines = text.split("\n");
                    const block_height = line_height * lines.length;
                    const baseline = this.visuals.text.cache_select("text_baseline", i);
                    let y;
                    switch (baseline) {
                        case "top": {
                            y = 0;
                            break;
                        }
                        case "middle": {
                            y = (-block_height / 2) + (line_height / 2);
                            break;
                        }
                        case "bottom": {
                            y = -block_height + line_height;
                            break;
                        }
                        default: {
                            y = 0;
                            console.warn(`'${baseline}' baseline not supported with multi line text`);
                        }
                    }
                    for (const line of lines) {
                        ctx.fillText(line, 0, y);
                        const x0 = sx[i] + _x_offset[i];
                        const y0 = y + sy[i] + _y_offset[i];
                        const width = ctx.measureText(line).width;
                        const [xvalues, yvalues] = this._text_bounds(x0, y0, width, line_height);
                        this._sxs[i].push(xvalues);
                        this._sys[i].push(yvalues);
                        y += line_height;
                    }
                }
                ctx.restore();
            }
        }
    }
    _hit_point(geometry) {
        const { sx, sy } = geometry;
        const indices = [];
        for (let i = 0; i < this._sxs.length; i++) {
            const sxs = this._sxs[i];
            const sys = this._sys[i];
            const n = sxs.length;
            for (let j = 0, endj = n; j < endj; j++) {
                const [sxr, syr] = this._rotate_point(sx, sy, sxs[n - 1][0], sys[n - 1][0], -this._angle[i]);
                if (hittest.point_in_poly(sxr, syr, sxs[j], sys[j])) {
                    indices.push(i);
                }
            }
        }
        return new Selection({ indices });
    }
    scenterxy(i) {
        const sxs = this._sxs[i];
        const sys = this._sys[i];
        assert(sxs.length != 0 && sys.length != 0);
        const sx0 = sxs[0][0];
        const sy0 = sys[0][0];
        const sxc = (sxs[0][2] + sx0) / 2;
        const syc = (sys[0][2] + sy0) / 2;
        const [sxcr, sycr] = this._rotate_point(sxc, syc, sx0, sy0, this._angle[i]);
        return [sxcr, sycr];
    }
}
TextView.__name__ = "TextView";
export class Text extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_Text() {
        this.prototype.default_view = TextView;
        this.mixins(TextVector);
        this.define({
            text: [p.NullStringSpec, { field: "text" }],
            angle: [p.AngleSpec, 0],
            x_offset: [p.NumberSpec, 0],
            y_offset: [p.NumberSpec, 0],
        });
    }
}
Text.__name__ = "Text";
Text.init_Text();
//# sourceMappingURL=text.js.map