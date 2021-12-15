import { NumberArray } from "../../core/types";
import { Area, AreaView } from "./area";
import * as hittest from "../../core/hittest";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
export class VAreaView extends AreaView {
    _index_data(index) {
        const { min, max } = Math;
        const { data_size } = this;
        for (let i = 0; i < data_size; i++) {
            const x = this._x[i];
            const y1 = this._y1[i];
            const y2 = this._y2[i];
            if (isNaN(x + y1 + y2) || !isFinite(x + y1 + y2))
                index.add_empty();
            else
                index.add(x, min(y1, y2), x, max(y1, y2));
        }
    }
    _inner(ctx, sx, sy1, sy2, func) {
        ctx.beginPath();
        for (let i = 0, end = sy1.length; i < end; i++) {
            ctx.lineTo(sx[i], sy1[i]);
        }
        // iterate backwards so that the upper end is below the lower start
        for (let i = sy2.length - 1; i >= 0; i--) {
            ctx.lineTo(sx[i], sy2[i]);
        }
        ctx.closePath();
        func.call(ctx);
    }
    _render(ctx, _indices, { sx, sy1, sy2 }) {
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            this._inner(ctx, sx, sy1, sy2, ctx.fill);
        }
        this.visuals.hatch.doit2(ctx, 0, () => this._inner(ctx, sx, sy1, sy2, ctx.fill), () => this.renderer.request_render());
    }
    scenterxy(i) {
        const scx = this.sx[i];
        const scy = (this.sy1[i] + this.sy2[i]) / 2;
        return [scx, scy];
    }
    _hit_point(geometry) {
        const L = this.sx.length;
        const sx = new NumberArray(2 * L);
        const sy = new NumberArray(2 * L);
        for (let i = 0, end = L; i < end; i++) {
            sx[i] = this.sx[i];
            sy[i] = this.sy1[i];
            sx[L + i] = this.sx[L - i - 1];
            sy[L + i] = this.sy2[L - i - 1];
        }
        const result = new Selection();
        if (hittest.point_in_poly(geometry.sx, geometry.sy, sx, sy)) {
            result.add_to_selected_glyphs(this.model);
            result.view = this;
        }
        return result;
    }
    _map_data() {
        this.sx = this.renderer.xscale.v_compute(this._x);
        this.sy1 = this.renderer.yscale.v_compute(this._y1);
        this.sy2 = this.renderer.yscale.v_compute(this._y2);
    }
}
VAreaView.__name__ = "VAreaView";
export class VArea extends Area {
    constructor(attrs) {
        super(attrs);
    }
    static init_VArea() {
        this.prototype.default_view = VAreaView;
        this.define({
            x: [p.XCoordinateSpec, { field: "x" }],
            y1: [p.YCoordinateSpec, { field: "y1" }],
            y2: [p.YCoordinateSpec, { field: "y2" }],
        });
    }
}
VArea.__name__ = "VArea";
VArea.init_VArea();
//# sourceMappingURL=varea.js.map