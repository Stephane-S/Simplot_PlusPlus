import { Box, BoxView } from "./box";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export class VBarView extends BoxView {
    scenterxy(i) {
        const scx = this.sx[i];
        const scy = (this.stop[i] + this.sbottom[i]) / 2;
        return [scx, scy];
    }
    _lrtb(i) {
        const l = this._x[i] - (this._width[i] / 2);
        const r = this._x[i] + (this._width[i] / 2);
        const t = Math.max(this._top[i], this._bottom[i]);
        const b = Math.min(this._top[i], this._bottom[i]);
        return [l, r, t, b];
    }
    _map_data() {
        this.sx = this.renderer.xscale.v_compute(this._x);
        this.sw = this.sdist(this.renderer.xscale, this._x, this._width, "center");
        this.stop = this.renderer.yscale.v_compute(this._top);
        this.sbottom = this.renderer.yscale.v_compute(this._bottom);
        const n = this.sx.length;
        this.sleft = new NumberArray(n);
        this.sright = new NumberArray(n);
        for (let i = 0; i < n; i++) {
            this.sleft[i] = this.sx[i] - this.sw[i] / 2;
            this.sright[i] = this.sx[i] + this.sw[i] / 2;
        }
        this._clamp_viewport();
    }
}
VBarView.__name__ = "VBarView";
export class VBar extends Box {
    constructor(attrs) {
        super(attrs);
    }
    static init_VBar() {
        this.prototype.default_view = VBarView;
        this.define({
            x: [p.XCoordinateSpec, { field: "x" }],
            bottom: [p.YCoordinateSpec, { value: 0 }],
            width: [p.NumberSpec, { value: 1 }],
            top: [p.YCoordinateSpec, { field: "top" }],
        });
    }
}
VBar.__name__ = "VBar";
VBar.init_VBar();
//# sourceMappingURL=vbar.js.map