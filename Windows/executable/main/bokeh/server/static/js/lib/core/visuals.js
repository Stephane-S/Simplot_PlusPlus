import * as mixins from "./property_mixins";
import * as p from "./properties";
import { color2rgba, decode_rgba } from "./util/color";
import { isString } from "./util/types";
import { SVGRenderingContext2D } from "./util/svg";
import { CanvasLayer } from "../models/canvas/canvas";
function color2css(color, alpha) {
    const [r, g, b, a] = isString(color) ? color2rgba(color) : decode_rgba(color);
    return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a == 1.0 ? alpha : a})`;
}
function _horz(ctx, h, h2) {
    ctx.moveTo(0, h2 + 0.5);
    ctx.lineTo(h, h2 + 0.5);
    ctx.stroke();
}
function _vert(ctx, h, h2) {
    ctx.moveTo(h2 + 0.5, 0);
    ctx.lineTo(h2 + 0.5, h);
    ctx.stroke();
}
function _x(ctx, h) {
    ctx.moveTo(0, h);
    ctx.lineTo(h, 0);
    ctx.stroke();
    ctx.moveTo(0, 0);
    ctx.lineTo(h, h);
    ctx.stroke();
}
export const hatch_aliases = {
    " ": "blank",
    ".": "dot",
    o: "ring",
    "-": "horizontal_line",
    "|": "vertical_line",
    "+": "cross",
    "\"": "horizontal_dash",
    ":": "vertical_dash",
    "@": "spiral",
    "/": "right_diagonal_line",
    "\\": "left_diagonal_line",
    x: "diagonal_cross",
    ",": "right_diagonal_dash",
    "`": "left_diagonal_dash",
    v: "horizontal_wave",
    ">": "vertical_wave",
    "*": "criss_cross",
};
function create_hatch_canvas(ctx, hatch_pattern, hatch_color, hatch_alpha, hatch_scale, hatch_weight) {
    var _a;
    const h = hatch_scale;
    const h2 = h / 2;
    const h4 = h2 / 2;
    ctx.strokeStyle = color2css(hatch_color, hatch_alpha);
    ctx.lineCap = "square";
    ctx.fillStyle = hatch_color;
    ctx.lineWidth = hatch_weight;
    switch ((_a = hatch_aliases[hatch_pattern]) !== null && _a !== void 0 ? _a : hatch_pattern) {
        // we should not need these if code conditions on hatch.doit, but
        // include them here just for completeness
        case "blank":
            break;
        case "dot":
            ctx.arc(h2, h2, h2 / 2, 0, 2 * Math.PI, true);
            ctx.fill();
            break;
        case "ring":
            ctx.arc(h2, h2, h2 / 2, 0, 2 * Math.PI, true);
            ctx.stroke();
            break;
        case "horizontal_line":
            _horz(ctx, h, h2);
            break;
        case "vertical_line":
            _vert(ctx, h, h2);
            break;
        case "cross":
            _horz(ctx, h, h2);
            _vert(ctx, h, h2);
            break;
        case "horizontal_dash":
            _horz(ctx, h2, h2);
            break;
        case "vertical_dash":
            _vert(ctx, h2, h2);
            break;
        case "spiral": {
            const h30 = h / 30;
            ctx.moveTo(h2, h2);
            for (let i = 0; i < 360; i++) {
                const angle = 0.1 * i;
                const x = h2 + (h30 * angle) * Math.cos(angle);
                const y = h2 + (h30 * angle) * Math.sin(angle);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            break;
        }
        case "right_diagonal_line":
            ctx.moveTo(-h4 + 0.5, h);
            ctx.lineTo(h4 + 0.5, 0);
            ctx.stroke();
            ctx.moveTo(h4 + 0.5, h);
            ctx.lineTo(3 * h4 + 0.5, 0);
            ctx.stroke();
            ctx.moveTo(3 * h4 + 0.5, h);
            ctx.lineTo(5 * h4 + 0.5, 0);
            ctx.stroke();
            ctx.stroke();
            break;
        case "left_diagonal_line":
            ctx.moveTo(h4 + 0.5, h);
            ctx.lineTo(-h4 + 0.5, 0);
            ctx.stroke();
            ctx.moveTo(3 * h4 + 0.5, h);
            ctx.lineTo(h4 + 0.5, 0);
            ctx.stroke();
            ctx.moveTo(5 * h4 + 0.5, h);
            ctx.lineTo(3 * h4 + 0.5, 0);
            ctx.stroke();
            ctx.stroke();
            break;
        case "diagonal_cross":
            _x(ctx, h);
            break;
        case "right_diagonal_dash":
            ctx.moveTo(h4 + 0.5, 3 * h4 + 0.5);
            ctx.lineTo(3 * h4 + 0.5, h4 + 0.5);
            ctx.stroke();
            break;
        case "left_diagonal_dash":
            ctx.moveTo(h4 + 0.5, h4 + 0.5);
            ctx.lineTo(3 * h4 + 0.5, 3 * h4 + 0.5);
            ctx.stroke();
            break;
        case "horizontal_wave":
            ctx.moveTo(0, h4);
            ctx.lineTo(h2, 3 * h4);
            ctx.lineTo(h, h4);
            ctx.stroke();
            break;
        case "vertical_wave":
            ctx.moveTo(h4, 0);
            ctx.lineTo(3 * h4, h2);
            ctx.lineTo(h4, h);
            ctx.stroke();
            break;
        case "criss_cross":
            _x(ctx, h);
            _horz(ctx, h, h2);
            _vert(ctx, h, h2);
            break;
    }
}
export class ContextProperties {
    constructor(obj, prefix = "") {
        this.obj = obj;
        this.prefix = prefix;
        this.cache = {};
        for (const attr of this.attrs)
            this[attr] = obj.properties[prefix + attr];
    }
    warm_cache(source, all_indices) {
        for (const attr of this.attrs) {
            const prop = this.obj.properties[this.prefix + attr];
            if (prop.spec.value !== undefined) // TODO (bev) better test?
                this.cache[attr] = prop.spec.value;
            else if (source != null && prop instanceof p.VectorSpec) {
                const array = prop.array(source);
                const subarray = all_indices != null ? all_indices.select(array) : array;
                this.cache[attr + "_array"] = subarray;
            }
            else
                throw new Error("source is required with a vectorized visual property");
        }
    }
    cache_select(attr, i) {
        const prop = this.obj.properties[this.prefix + attr];
        let value;
        if (prop.spec.value !== undefined) // TODO (bev) better test?
            this.cache[attr] = value = prop.spec.value;
        else
            this.cache[attr] = value = this.cache[attr + "_array"][i];
        return value;
    }
    get_array(attr) {
        return this.cache[attr + "_array"];
    }
    set_vectorize(ctx, i) {
        this._set_vectorize(ctx, i);
    }
}
ContextProperties.__name__ = "ContextProperties";
export class Line extends ContextProperties {
    set_value(ctx) {
        const color = this.line_color.value();
        const alpha = this.line_alpha.value();
        ctx.strokeStyle = color2css(color, alpha);
        ctx.lineWidth = this.line_width.value();
        ctx.lineJoin = this.line_join.value();
        ctx.lineCap = this.line_cap.value();
        ctx.lineDash = this.line_dash.value();
        ctx.lineDashOffset = this.line_dash_offset.value();
    }
    get doit() {
        return !(this.line_color.spec.value === null ||
            this.line_alpha.spec.value == 0 ||
            this.line_width.spec.value == 0);
    }
    _set_vectorize(ctx, i) {
        const color = this.cache_select("line_color", i);
        const alpha = this.cache_select("line_alpha", i);
        const width = this.cache_select("line_width", i);
        const join = this.cache_select("line_join", i);
        const cap = this.cache_select("line_cap", i);
        const dash = this.cache_select("line_dash", i);
        const offset = this.cache_select("line_dash_offset", i);
        ctx.strokeStyle = color2css(color, alpha);
        ctx.lineWidth = width;
        ctx.lineJoin = join;
        ctx.lineCap = cap;
        ctx.lineDash = dash;
        ctx.lineDashOffset = offset;
    }
    color_value() {
        return color2css(this.line_color.value(), this.line_alpha.value());
    }
}
Line.__name__ = "Line";
Line.prototype.attrs = Object.keys(mixins.LineVector);
export class Fill extends ContextProperties {
    set_value(ctx) {
        const color = this.fill_color.value();
        const alpha = this.fill_alpha.value();
        ctx.fillStyle = color2css(color, alpha);
    }
    get doit() {
        return !(this.fill_color.spec.value === null ||
            this.fill_alpha.spec.value == 0);
    }
    _set_vectorize(ctx, i) {
        const color = this.cache_select("fill_color", i);
        const alpha = this.cache_select("fill_alpha", i);
        ctx.fillStyle = color2css(color, alpha);
    }
    color_value() {
        return color2css(this.fill_color.value(), this.fill_alpha.value());
    }
}
Fill.__name__ = "Fill";
Fill.prototype.attrs = Object.keys(mixins.FillVector);
export class Hatch extends ContextProperties {
    cache_select(name, i) {
        let value;
        if (name == "pattern") {
            const color = this.cache_select("hatch_color", i);
            const alpha = this.cache_select("hatch_alpha", i);
            const scale = this.cache_select("hatch_scale", i);
            const pattern = this.cache_select("hatch_pattern", i);
            const weight = this.cache_select("hatch_weight", i);
            const { hatch_extra } = this.cache;
            if (hatch_extra != null && hatch_extra.hasOwnProperty(pattern)) {
                const custom = hatch_extra[pattern];
                this.cache.pattern = custom.get_pattern(color, alpha, scale, weight);
            }
            else {
                this.cache.pattern = (ctx) => {
                    // TODO: this needs a canvas provider instead of trying to guess what to use
                    const output_backend = ctx instanceof SVGRenderingContext2D ? "svg" : "canvas";
                    const region = new CanvasLayer(output_backend, true);
                    region.resize(scale, scale);
                    region.prepare();
                    create_hatch_canvas(region.ctx, pattern, color, alpha, scale, weight);
                    return ctx.createPattern(region.canvas, "repeat");
                };
            }
        }
        else
            value = super.cache_select(name, i);
        return value;
    }
    _try_defer(defer_func) {
        const { hatch_pattern, hatch_extra } = this.cache;
        if (hatch_extra != null && hatch_extra.hasOwnProperty(hatch_pattern)) {
            const custom = hatch_extra[hatch_pattern];
            custom.onload(defer_func);
        }
    }
    get doit() {
        return !(this.hatch_color.spec.value === null ||
            this.hatch_alpha.spec.value == 0 ||
            this.hatch_pattern.spec.value == " " ||
            this.hatch_pattern.spec.value == "blank" ||
            this.hatch_pattern.spec.value === null);
    }
    doit2(ctx, i, ready_func, defer_func) {
        if (!this.doit) {
            return;
        }
        this.cache_select("pattern", i);
        const pattern = this.cache.pattern(ctx);
        if (pattern == null) {
            this._try_defer(defer_func);
        }
        else {
            this.set_vectorize(ctx, i);
            ready_func();
        }
    }
    _set_vectorize(ctx, i) {
        this.cache_select("pattern", i);
        ctx.fillStyle = this.cache.pattern(ctx);
    }
    color_value() {
        return color2css(this.hatch_color.value(), this.hatch_alpha.value());
    }
}
Hatch.__name__ = "Hatch";
Hatch.prototype.attrs = Object.keys(mixins.HatchVector);
export class Text extends ContextProperties {
    color_value() {
        return color2css(this.text_color.value(), this.text_alpha.value());
    }
    font_value() {
        const text_font = this.text_font.value();
        const text_font_size = this.text_font_size.value();
        const text_font_style = this.text_font_style.value();
        return `${text_font_style} ${text_font_size} ${text_font}`;
    }
    v_font_value(i) {
        super.cache_select("text_font_style", i);
        super.cache_select("text_font_size", i);
        super.cache_select("text_font", i);
        const { text_font_style, text_font_size, text_font } = this.cache;
        return `${text_font_style} ${text_font_size} ${text_font}`;
    }
    cache_select(name, i) {
        let value;
        if (name == "font") {
            this.cache.font = value = this.v_font_value(i);
        }
        else
            value = super.cache_select(name, i);
        return value;
    }
    set_value(ctx) {
        const color = this.text_color.value();
        const alpha = this.text_alpha.value();
        ctx.fillStyle = color2css(color, alpha);
        ctx.font = this.font_value();
        ctx.textAlign = this.text_align.value();
        ctx.textBaseline = this.text_baseline.value();
    }
    get doit() {
        return !(this.text_color.spec.value === null ||
            this.text_alpha.spec.value == 0);
    }
    _set_vectorize(ctx, i) {
        const color = this.cache_select("text_color", i);
        const alpha = this.cache_select("text_alpha", i);
        const font = this.cache_select("font", i);
        const align = this.cache_select("text_align", i);
        const baseline = this.cache_select("text_baseline", i);
        ctx.fillStyle = color2css(color, alpha);
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
    }
}
Text.__name__ = "Text";
Text.prototype.attrs = Object.keys(mixins.TextVector);
export class Visuals {
    constructor(model) {
        for (const mixin of model._mixins) {
            const [name, prefix = ""] = mixin.split(":");
            let cls;
            switch (name) {
                case "line":
                    cls = Line;
                    break;
                case "fill":
                    cls = Fill;
                    break;
                case "hatch":
                    cls = Hatch;
                    break;
                case "text":
                    cls = Text;
                    break;
                default:
                    throw new Error(`unknown visual: ${name}`);
            }
            this[prefix + name] = new cls(model, prefix);
        }
    }
    warm_cache(source, all_indices) {
        for (const name in this) {
            if (this.hasOwnProperty(name)) {
                const prop = this[name];
                if (prop instanceof ContextProperties)
                    prop.warm_cache(source, all_indices);
            }
        }
    }
}
Visuals.__name__ = "Visuals";
//# sourceMappingURL=visuals.js.map