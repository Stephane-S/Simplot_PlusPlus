import * as hittest from "../../core/hittest";
import * as p from "../../core/properties";
import { LineVector } from "../../core/property_mixins";
import { inplace } from "../../core/util/projections";
import { Glyph, GlyphView } from "./glyph";
import { generic_line_legend } from "./utils";
import { Selection } from "../selections/selection";
export class SegmentView extends GlyphView {
    _project_data() {
        inplace.project_xy(this._x0, this._y0);
        inplace.project_xy(this._x1, this._y1);
    }
    _index_data(index) {
        const { min, max } = Math;
        const { data_size } = this;
        for (let i = 0; i < data_size; i++) {
            const x0 = this._x0[i];
            const x1 = this._x1[i];
            const y0 = this._y0[i];
            const y1 = this._y1[i];
            if (isNaN(x0 + x1 + y0 + y1))
                index.add_empty();
            else
                index.add(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1));
        }
    }
    _render(ctx, indices, { sx0, sy0, sx1, sy1 }) {
        if (this.visuals.line.doit) {
            for (const i of indices) {
                if (isNaN(sx0[i] + sy0[i] + sx1[i] + sy1[i]))
                    continue;
                ctx.beginPath();
                ctx.moveTo(sx0[i], sy0[i]);
                ctx.lineTo(sx1[i], sy1[i]);
                this.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
            }
        }
    }
    _hit_point(geometry) {
        const { sx, sy } = geometry;
        const point = { x: sx, y: sy };
        const lw_voffset = 2; // FIXME: Use maximum of segments line_width/2 instead of magic constant 2
        const [x0, x1] = this.renderer.xscale.r_invert(sx - lw_voffset, sx + lw_voffset);
        const [y0, y1] = this.renderer.yscale.r_invert(sy - lw_voffset, sy + lw_voffset);
        const candidates = this.index.indices({ x0, y0, x1, y1 });
        const indices = [];
        for (const i of candidates) {
            const threshold2 = Math.max(2, this.visuals.line.cache_select('line_width', i) / 2) ** 2;
            const p0 = { x: this.sx0[i], y: this.sy0[i] };
            const p1 = { x: this.sx1[i], y: this.sy1[i] };
            const dist2 = hittest.dist_to_segment_squared(point, p0, p1);
            if (dist2 < threshold2) {
                indices.push(i);
            }
        }
        return new Selection({ indices });
    }
    _hit_span(geometry) {
        const [hr, vr] = this.renderer.plot_view.frame.bbox.ranges;
        const { sx, sy } = geometry;
        let v0;
        let v1;
        let val;
        if (geometry.direction == 'v') {
            val = this.renderer.yscale.invert(sy);
            [v0, v1] = [this._y0, this._y1];
        }
        else {
            val = this.renderer.xscale.invert(sx);
            [v0, v1] = [this._x0, this._x1];
        }
        const indices = [];
        const [x0, x1] = this.renderer.xscale.r_invert(hr.start, hr.end);
        const [y0, y1] = this.renderer.yscale.r_invert(vr.start, vr.end);
        const candidates = this.index.indices({ x0, y0, x1, y1 });
        for (const i of candidates) {
            if ((v0[i] <= val && val <= v1[i]) || (v1[i] <= val && val <= v0[i]))
                indices.push(i);
            const threshold = 1.5 + (this.visuals.line.cache_select('line_width', i) / 2); // Maximum pixel difference to detect hit
            if (v0[i] == v1[i]) {
                if (geometry.direction == 'h') {
                    if (Math.abs(this.sx0[i] - sx) <= threshold) {
                        indices.push(i);
                    }
                }
                else {
                    if (Math.abs(this.sy0[i] - sy) <= threshold) {
                        indices.push(i);
                    }
                }
            }
        }
        return new Selection({ indices });
    }
    scenterxy(i) {
        const scx = (this.sx0[i] + this.sx1[i]) / 2;
        const scy = (this.sy0[i] + this.sy1[i]) / 2;
        return [scx, scy];
    }
    draw_legend_for_index(ctx, bbox, index) {
        generic_line_legend(this.visuals, ctx, bbox, index);
    }
}
SegmentView.__name__ = "SegmentView";
export class Segment extends Glyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_Segment() {
        this.prototype.default_view = SegmentView;
        this.define({
            x0: [p.XCoordinateSpec, { field: "x0" }],
            y0: [p.YCoordinateSpec, { field: "y0" }],
            x1: [p.XCoordinateSpec, { field: "x1" }],
            y1: [p.YCoordinateSpec, { field: "y1" }],
        });
        this.mixins(LineVector);
    }
}
Segment.__name__ = "Segment";
Segment.init_Segment();
//# sourceMappingURL=segment.js.map