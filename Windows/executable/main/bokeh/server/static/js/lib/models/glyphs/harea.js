import { NumberArray } from "../../core/types";
import { Area, AreaView } from "./area";
import * as hittest from "../../core/hittest";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
export class HAreaView extends AreaView {
    _index_data(index) {
        const { min, max } = Math;
        const { data_size } = this;
        for (let i = 0; i < data_size; i++) {
            const x1 = this._x1[i];
            const x2 = this._x2[i];
            const y = this._y[i];
            if (isNaN(x1 + x2 + y) || !isFinite(x1 + x2 + y))
                index.add_empty();
            else
                index.add(min(x1, x2), y, max(x1, x2), y);
        }
    }
    _inner(ctx, sx1, sx2, sy, func) {
        ctx.beginPath();
        for (let i = 0, end = sx1.length; i < end; i++) {
            ctx.lineTo(sx1[i], sy[i]);
        }
        // iterate backwards so that the upper end is below the lower start
        for (let i = sx2.length - 1; i >= 0; i--) {
            ctx.lineTo(sx2[i], sy[i]);
        }
        ctx.closePath();
        func.call(ctx);
    }
    _render(ctx, _indices, { sx1, sx2, sy }) {
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            this._inner(ctx, sx1, sx2, sy, ctx.fill);
        }
        this.visuals.hatch.doit2(ctx, 0, () => this._inner(ctx, sx1, sx2, sy, ctx.fill), () => this.renderer.request_render());
    }
    _hit_point(geometry) {
        const L = this.sy.length;
        const sx = new NumberArray(2 * L);
        const sy = new NumberArray(2 * L);
        for (let i = 0, end = L; i < end; i++) {
            sx[i] = this.sx1[i];
            sy[i] = this.sy[i];
            sx[L + i] = this.sx2[L - i - 1];
            sy[L + i] = this.sy[L - i - 1];
        }
        const result = new Selection();
        if (hittest.point_in_poly(geometry.sx, geometry.sy, sx, sy)) {
            result.add_to_selected_glyphs(this.model);
            result.view = this;
        }
        return result;
    }
    scenterxy(i) {
        const scx = (this.sx1[i] + this.sx2[i]) / 2;
        const scy = this.sy[i];
        return [scx, scy];
    }
    _map_data() {
        this.sx1 = this.renderer.xscale.v_compute(this._x1);
        this.sx2 = this.renderer.xscale.v_compute(this._x2);
        this.sy = this.renderer.yscale.v_compute(this._y);
    }
}
HAreaView.__name__ = "HAreaView";
export class HArea extends Area {
    constructor(attrs) {
        super(attrs);
    }
    static init_HArea() {
        this.prototype.default_view = HAreaView;
        this.define({
            x1: [p.XCoordinateSpec, { field: "x1" }],
            x2: [p.XCoordinateSpec, { field: "x2" }],
            y: [p.YCoordinateSpec, { field: "y" }],
        });
    }
}
HArea.__name__ = "HArea";
HArea.init_HArea();
//# sourceMappingURL=harea.js.map