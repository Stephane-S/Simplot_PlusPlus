import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { generic_area_legend } from "./utils";
import { LineVector, FillVector } from "../../core/property_mixins";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
import { angle_between } from "../../core/util/math";
import { Selection } from "../selections/selection";
export class AnnularWedgeView extends XYGlyphView {
    _map_data() {
        if (this.model.properties.inner_radius.units == "data")
            this.sinner_radius = this.sdist(this.renderer.xscale, this._x, this._inner_radius);
        else
            this.sinner_radius = this._inner_radius;
        if (this.model.properties.outer_radius.units == "data")
            this.souter_radius = this.sdist(this.renderer.xscale, this._x, this._outer_radius);
        else
            this.souter_radius = this._outer_radius;
        this._angle = new NumberArray(this._start_angle.length);
        for (let i = 0, end = this._start_angle.length; i < end; i++) {
            this._angle[i] = this._end_angle[i] - this._start_angle[i];
        }
    }
    _render(ctx, indices, { sx, sy, _start_angle, _angle, sinner_radius, souter_radius }) {
        const direction = this.model.properties.direction.value();
        for (const i of indices) {
            if (isNaN(sx[i] + sy[i] + sinner_radius[i] + souter_radius[i] + _start_angle[i] + _angle[i]))
                continue;
            ctx.translate(sx[i], sy[i]);
            ctx.rotate(_start_angle[i]);
            ctx.beginPath();
            ctx.moveTo(souter_radius[i], 0);
            ctx.arc(0, 0, souter_radius[i], 0, _angle[i], direction);
            ctx.rotate(_angle[i]);
            ctx.lineTo(sinner_radius[i], 0);
            ctx.arc(0, 0, sinner_radius[i], 0, -_angle[i], !direction);
            ctx.closePath();
            ctx.rotate(-_angle[i] - _start_angle[i]);
            ctx.translate(-sx[i], -sy[i]);
            if (this.visuals.fill.doit) {
                this.visuals.fill.set_vectorize(ctx, i);
                ctx.fill();
            }
            if (this.visuals.line.doit) {
                this.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
            }
        }
    }
    _hit_point(geometry) {
        const { sx, sy } = geometry;
        const x = this.renderer.xscale.invert(sx);
        const y = this.renderer.yscale.invert(sy);
        // check radius first
        let x0, y0;
        let x1, y1;
        if (this.model.properties.outer_radius.units == "data") {
            x0 = x - this.max_outer_radius;
            x1 = x + this.max_outer_radius;
            y0 = y - this.max_outer_radius;
            y1 = y + this.max_outer_radius;
        }
        else {
            const sx0 = sx - this.max_outer_radius;
            const sx1 = sx + this.max_outer_radius;
            [x0, x1] = this.renderer.xscale.r_invert(sx0, sx1);
            const sy0 = sy - this.max_outer_radius;
            const sy1 = sy + this.max_outer_radius;
            [y0, y1] = this.renderer.yscale.r_invert(sy0, sy1);
        }
        const candidates = [];
        for (const i of this.index.indices({ x0, x1, y0, y1 })) {
            const or2 = this.souter_radius[i] ** 2;
            const ir2 = this.sinner_radius[i] ** 2;
            const [sx0, sx1] = this.renderer.xscale.r_compute(x, this._x[i]);
            const [sy0, sy1] = this.renderer.yscale.r_compute(y, this._y[i]);
            const dist = (sx0 - sx1) ** 2 + (sy0 - sy1) ** 2;
            if (dist <= or2 && dist >= ir2)
                candidates.push(i);
        }
        const direction = this.model.properties.direction.value();
        const indices = [];
        for (const i of candidates) {
            // NOTE: minus the angle because JS uses non-mathy convention for angles
            const angle = Math.atan2(sy - this.sy[i], sx - this.sx[i]);
            if (angle_between(-angle, -this._start_angle[i], -this._end_angle[i], direction)) {
                indices.push(i);
            }
        }
        return new Selection({ indices });
    }
    draw_legend_for_index(ctx, bbox, index) {
        generic_area_legend(this.visuals, ctx, bbox, index);
    }
    scenterxy(i) {
        const r = (this.sinner_radius[i] + this.souter_radius[i]) / 2;
        const a = (this._start_angle[i] + this._end_angle[i]) / 2;
        const scx = this.sx[i] + r * Math.cos(a);
        const scy = this.sy[i] + r * Math.sin(a);
        return [scx, scy];
    }
}
AnnularWedgeView.__name__ = "AnnularWedgeView";
export class AnnularWedge extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_AnnularWedge() {
        this.prototype.default_view = AnnularWedgeView;
        this.mixins([LineVector, FillVector]);
        this.define({
            direction: [p.Direction, 'anticlock'],
            inner_radius: [p.DistanceSpec],
            outer_radius: [p.DistanceSpec],
            start_angle: [p.AngleSpec],
            end_angle: [p.AngleSpec],
        });
    }
}
AnnularWedge.__name__ = "AnnularWedge";
AnnularWedge.init_AnnularWedge();
//# sourceMappingURL=annular_wedge.js.map