import { GuideRenderer, GuideRendererView } from "../renderers/guide_renderer";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
import { sum } from "../../core/util/array";
import { isString, isNumber } from "../../core/util/types";
import { FactorRange } from "../ranges/factor_range";
const { abs, min, max } = Math;
export class AxisView extends GuideRendererView {
    constructor() {
        super(...arguments);
        this.rotate = true;
    }
    get panel() {
        return this.layout;
    }
    get is_renderable() {
        const [range, cross_range] = this.ranges;
        return range.is_valid && cross_range.is_valid;
    }
    _render() {
        var _a;
        if (!this.is_renderable)
            return;
        const extents = {
            tick: this._tick_extent(),
            tick_label: this._tick_label_extents(),
            axis_label: this._axis_label_extent(),
        };
        const { tick_coords } = this;
        const ctx = this.layer.ctx;
        ctx.save();
        this._draw_rule(ctx, extents);
        this._draw_major_ticks(ctx, extents, tick_coords);
        this._draw_minor_ticks(ctx, extents, tick_coords);
        this._draw_major_labels(ctx, extents, tick_coords);
        this._draw_axis_label(ctx, extents, tick_coords);
        (_a = this._paint) === null || _a === void 0 ? void 0 : _a.call(this, ctx, extents, tick_coords);
        ctx.restore();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.plot_view.request_layout());
    }
    get_size() {
        if (this.model.visible && this.model.fixed_location == null && this.is_renderable) {
            const size = this._get_size();
            return { width: 0 /* max */, height: Math.round(size) };
        }
        else
            return { width: 0, height: 0 };
    }
    _get_size() {
        return this._tick_extent() + this._tick_label_extent() + this._axis_label_extent();
    }
    get needs_clip() {
        return this.model.fixed_location != null;
    }
    // drawing sub functions -----------------------------------------------------
    _draw_rule(ctx, _extents) {
        if (!this.visuals.axis_line.doit)
            return;
        const [xs, ys] = this.rule_coords;
        const [sxs, sys] = this.coordinates.map_to_screen(xs, ys);
        const [nx, ny] = this.normals;
        const [xoff, yoff] = this.offsets;
        this.visuals.axis_line.set_value(ctx);
        ctx.beginPath();
        ctx.moveTo(Math.round(sxs[0] + nx * xoff), Math.round(sys[0] + ny * yoff));
        for (let i = 1; i < sxs.length; i++) {
            const sx = Math.round(sxs[i] + nx * xoff);
            const sy = Math.round(sys[i] + ny * yoff);
            ctx.lineTo(sx, sy);
        }
        ctx.stroke();
    }
    _draw_major_ticks(ctx, _extents, tick_coords) {
        const tin = this.model.major_tick_in;
        const tout = this.model.major_tick_out;
        const visuals = this.visuals.major_tick_line;
        this._draw_ticks(ctx, tick_coords.major, tin, tout, visuals);
    }
    _draw_minor_ticks(ctx, _extents, tick_coords) {
        const tin = this.model.minor_tick_in;
        const tout = this.model.minor_tick_out;
        const visuals = this.visuals.minor_tick_line;
        this._draw_ticks(ctx, tick_coords.minor, tin, tout, visuals);
    }
    _draw_major_labels(ctx, extents, tick_coords) {
        const coords = tick_coords.major;
        const labels = this.compute_labels(coords[this.dimension]);
        const orient = this.model.major_label_orientation;
        const standoff = extents.tick + this.model.major_label_standoff;
        const visuals = this.visuals.major_label_text;
        this._draw_oriented_labels(ctx, labels, coords, orient, this.panel.side, standoff, visuals);
    }
    _draw_axis_label(ctx, extents, _tick_coords) {
        if (this.model.axis_label == null || this.model.axis_label.length == 0 || this.model.fixed_location != null)
            return;
        let sx;
        let sy;
        const { bbox } = this.panel;
        switch (this.panel.side) {
            case "above":
                sx = bbox.hcenter;
                sy = bbox.bottom;
                break;
            case "below":
                sx = bbox.hcenter;
                sy = bbox.top;
                break;
            case "left":
                sx = bbox.right;
                sy = bbox.vcenter;
                break;
            case "right":
                sx = bbox.left;
                sy = bbox.vcenter;
                break;
            default:
                throw new Error(`unknown side: ${this.panel.side}`);
        }
        const coords = [[sx], [sy]];
        const standoff = extents.tick + sum(extents.tick_label) + this.model.axis_label_standoff;
        const visuals = this.visuals.axis_label_text;
        this._draw_oriented_labels(ctx, [this.model.axis_label], coords, 'parallel', this.panel.side, standoff, visuals, "screen");
    }
    _draw_ticks(ctx, coords, tin, tout, visuals) {
        if (!visuals.doit)
            return;
        const [x, y] = coords;
        const [sxs, sys] = this.coordinates.map_to_screen(x, y);
        const [nx, ny] = this.normals;
        const [xoff, yoff] = this.offsets;
        const [nxin, nyin] = [nx * (xoff - tin), ny * (yoff - tin)];
        const [nxout, nyout] = [nx * (xoff + tout), ny * (yoff + tout)];
        visuals.set_value(ctx);
        ctx.beginPath();
        for (let i = 0; i < sxs.length; i++) {
            const sx0 = Math.round(sxs[i] + nxout);
            const sy0 = Math.round(sys[i] + nyout);
            const sx1 = Math.round(sxs[i] + nxin);
            const sy1 = Math.round(sys[i] + nyin);
            ctx.moveTo(sx0, sy0);
            ctx.lineTo(sx1, sy1);
        }
        ctx.stroke();
    }
    _draw_oriented_labels(ctx, labels, coords, orient, _side, standoff, visuals, units = "data") {
        if (!visuals.doit || labels.length == 0)
            return;
        let sxs, sys;
        let xoff, yoff;
        if (units == "screen") {
            [sxs, sys] = coords;
            [xoff, yoff] = [0, 0];
        }
        else {
            const [dxs, dys] = coords;
            [sxs, sys] = this.coordinates.map_to_screen(dxs, dys);
            [xoff, yoff] = this.offsets;
        }
        const [nx, ny] = this.normals;
        const nxd = nx * (xoff + standoff);
        const nyd = ny * (yoff + standoff);
        visuals.set_value(ctx);
        this.panel.apply_label_text_heuristics(ctx, orient);
        let angle;
        if (isString(orient))
            angle = this.panel.get_label_angle_heuristic(orient);
        else
            angle = -orient;
        for (let i = 0; i < sxs.length; i++) {
            const sx = Math.round(sxs[i] + nxd);
            const sy = Math.round(sys[i] + nyd);
            ctx.translate(sx, sy);
            ctx.rotate(angle);
            ctx.fillText(labels[i], 0, 0);
            ctx.rotate(-angle);
            ctx.translate(-sx, -sy);
        }
    }
    // extents sub functions -----------------------------------------------------
    /*protected*/ _axis_label_extent() {
        if (this.model.axis_label == null || this.model.axis_label == "")
            return 0;
        const standoff = this.model.axis_label_standoff;
        const visuals = this.visuals.axis_label_text;
        return this._oriented_labels_extent([this.model.axis_label], "parallel", this.panel.side, standoff, visuals);
    }
    /*protected*/ _tick_extent() {
        return this.model.major_tick_out;
    }
    /*protected*/ _tick_label_extent() {
        return sum(this._tick_label_extents());
    }
    _tick_label_extents() {
        const coords = this.tick_coords.major;
        const labels = this.compute_labels(coords[this.dimension]);
        const orient = this.model.major_label_orientation;
        const standoff = this.model.major_label_standoff;
        const visuals = this.visuals.major_label_text;
        return [this._oriented_labels_extent(labels, orient, this.panel.side, standoff, visuals)];
    }
    _oriented_labels_extent(labels, orient, side, standoff, visuals) {
        if (labels.length == 0)
            return 0;
        const ctx = this.layer.ctx;
        visuals.set_value(ctx);
        let hscale;
        let angle;
        if (isString(orient)) {
            hscale = 1;
            angle = this.panel.get_label_angle_heuristic(orient);
        }
        else {
            hscale = 2;
            angle = -orient;
        }
        angle = Math.abs(angle);
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        let extent = 0;
        for (let i = 0; i < labels.length; i++) {
            const w = ctx.measureText(labels[i]).width * 1.1;
            const h = ctx.measureText(labels[i]).ascent * 0.9;
            let val;
            if (side == "above" || side == "below")
                val = w * s + (h / hscale) * c;
            else
                val = w * c + (h / hscale) * s;
            // update extent if current value is larger
            if (val > extent)
                extent = val;
        }
        // only apply the standoff if we already have non-zero extent
        if (extent > 0)
            extent += standoff;
        return extent;
    }
    // {{{ TODO: state
    get normals() {
        return this.panel.normals;
    }
    get dimension() {
        return this.panel.dimension;
    }
    compute_labels(ticks) {
        const labels = this.model.formatter.doFormat(ticks, this);
        for (let i = 0; i < ticks.length; i++) {
            if (ticks[i] in this.model.major_label_overrides)
                labels[i] = this.model.major_label_overrides[ticks[i]];
        }
        return labels;
    }
    get offsets() {
        // If we have a fixed_position then we should respect that exactly and
        // not apply any offsets (https://github.com/bokeh/bokeh/issues/8552)
        if (this.model.fixed_location != null)
            return [0, 0];
        const { frame } = this.plot_view;
        let [xoff, yoff] = [0, 0];
        switch (this.panel.side) {
            case "below":
                yoff = abs(this.panel.bbox.top - frame.bbox.bottom);
                break;
            case "above":
                yoff = abs(this.panel.bbox.bottom - frame.bbox.top);
                break;
            case "right":
                xoff = abs(this.panel.bbox.left - frame.bbox.right);
                break;
            case "left":
                xoff = abs(this.panel.bbox.right - frame.bbox.left);
                break;
        }
        return [xoff, yoff];
    }
    get ranges() {
        const i = this.dimension;
        const j = (i + 1) % 2;
        const { ranges } = this.coordinates;
        return [ranges[i], ranges[j]];
    }
    get computed_bounds() {
        const [range] = this.ranges;
        const user_bounds = this.model.bounds;
        const range_bounds = [range.min, range.max];
        if (user_bounds == "auto")
            return [range.min, range.max];
        else {
            let start;
            let end;
            const [user_start, user_end] = user_bounds;
            const [range_start, range_end] = range_bounds;
            if (abs(user_start - user_end) > abs(range_start - range_end)) {
                start = max(min(user_start, user_end), range_start);
                end = min(max(user_start, user_end), range_end);
            }
            else {
                start = min(user_start, user_end);
                end = max(user_start, user_end);
            }
            return [start, end];
        }
    }
    get rule_coords() {
        const i = this.dimension;
        const j = (i + 1) % 2;
        const [range] = this.ranges;
        const [start, end] = this.computed_bounds;
        const xs = new Array(2);
        const ys = new Array(2);
        const coords = [xs, ys];
        coords[i][0] = Math.max(start, range.min);
        coords[i][1] = Math.min(end, range.max);
        if (coords[i][0] > coords[i][1])
            coords[i][0] = coords[i][1] = NaN;
        coords[j][0] = this.loc;
        coords[j][1] = this.loc;
        return coords;
    }
    get tick_coords() {
        const i = this.dimension;
        const j = (i + 1) % 2;
        const [range] = this.ranges;
        const [start, end] = this.computed_bounds;
        const ticks = this.model.ticker.get_ticks(start, end, range, this.loc, {});
        const majors = ticks.major;
        const minors = ticks.minor;
        const xs = [];
        const ys = [];
        const coords = [xs, ys];
        const minor_xs = [];
        const minor_ys = [];
        const minor_coords = [minor_xs, minor_ys];
        const [range_min, range_max] = [range.min, range.max];
        for (let ii = 0; ii < majors.length; ii++) {
            if (majors[ii] < range_min || majors[ii] > range_max)
                continue;
            coords[i].push(majors[ii]);
            coords[j].push(this.loc);
        }
        for (let ii = 0; ii < minors.length; ii++) {
            if (minors[ii] < range_min || minors[ii] > range_max)
                continue;
            minor_coords[i].push(minors[ii]);
            minor_coords[j].push(this.loc);
        }
        return {
            major: coords,
            minor: minor_coords,
        };
    }
    get loc() {
        const { fixed_location } = this.model;
        if (fixed_location != null) {
            if (isNumber(fixed_location))
                return fixed_location;
            const [, cross_range] = this.ranges;
            if (cross_range instanceof FactorRange)
                return cross_range.synthetic(fixed_location);
            throw new Error("unexpected");
        }
        const [, cross_range] = this.ranges;
        switch (this.panel.side) {
            case 'left':
            case 'below':
                return cross_range.start;
            case 'right':
            case 'above':
                return cross_range.end;
        }
    }
    // }}}
    serializable_state() {
        return Object.assign(Object.assign({}, super.serializable_state()), { bbox: this.layout.bbox.box });
    }
}
AxisView.__name__ = "AxisView";
export class Axis extends GuideRenderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_Axis() {
        this.prototype.default_view = AxisView;
        this.mixins([
            ["axis_", mixins.Line],
            ["major_tick_", mixins.Line],
            ["minor_tick_", mixins.Line],
            ["major_label_", mixins.Text],
            ["axis_label_", mixins.Text],
        ]);
        this.define({
            bounds: [p.Any, 'auto'],
            ticker: [p.Instance],
            formatter: [p.Instance],
            axis_label: [p.String, ''],
            axis_label_standoff: [p.Int, 5],
            major_label_standoff: [p.Int, 5],
            major_label_orientation: [p.Any, "horizontal"],
            major_label_overrides: [p.Any, {}],
            major_tick_in: [p.Number, 2],
            major_tick_out: [p.Number, 6],
            minor_tick_in: [p.Number, 0],
            minor_tick_out: [p.Number, 4],
            fixed_location: [p.Any, null],
        });
        this.override({
            axis_line_color: 'black',
            major_tick_line_color: 'black',
            minor_tick_line_color: 'black',
            major_label_text_font_size: "11px",
            major_label_text_align: "center",
            major_label_text_baseline: "alphabetic",
            axis_label_text_font_size: "13px",
            axis_label_text_font_style: "italic",
        });
    }
}
Axis.__name__ = "Axis";
Axis.init_Axis();
//# sourceMappingURL=axis.js.map