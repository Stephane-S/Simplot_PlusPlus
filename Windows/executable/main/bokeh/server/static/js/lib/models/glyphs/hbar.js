import { Box, BoxView } from "./box";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export class HBarView extends BoxView {
    scenterxy(i) {
        const scx = (this.sleft[i] + this.sright[i]) / 2;
        const scy = this.sy[i];
        return [scx, scy];
    }
    _lrtb(i) {
        const l = Math.min(this._left[i], this._right[i]);
        const r = Math.max(this._left[i], this._right[i]);
        const t = this._y[i] + 0.5 * this._height[i];
        const b = this._y[i] - 0.5 * this._height[i];
        return [l, r, t, b];
    }
    _map_data() {
        this.sy = this.renderer.yscale.v_compute(this._y);
        this.sh = this.sdist(this.renderer.yscale, this._y, this._height, "center");
        this.sleft = this.renderer.xscale.v_compute(this._left);
        this.sright = this.renderer.xscale.v_compute(this._right);
        const n = this.sy.length;
        this.stop = new NumberArray(n);
        this.sbottom = new NumberArray(n);
        for (let i = 0; i < n; i++) {
            this.stop[i] = this.sy[i] - this.sh[i] / 2;
            this.sbottom[i] = this.sy[i] + this.sh[i] / 2;
        }
        this._clamp_viewport();
    }
}
HBarView.__name__ = "HBarView";
export class HBar extends Box {
    constructor(attrs) {
        super(attrs);
    }
    static init_HBar() {
        this.prototype.default_view = HBarView;
        this.define({
            left: [p.XCoordinateSpec, { value: 0 }],
            y: [p.YCoordinateSpec, { field: "y" }],
            height: [p.NumberSpec, { value: 1 }],
            right: [p.XCoordinateSpec, { field: "right" }],
        });
    }
}
HBar.__name__ = "HBar";
HBar.init_HBar();
//# sourceMappingURL=hbar.js.map