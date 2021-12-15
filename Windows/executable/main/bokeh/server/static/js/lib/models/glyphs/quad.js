import { Box, BoxView } from "./box";
import * as p from "../../core/properties";
export class QuadView extends BoxView {
    scenterxy(i) {
        const scx = (this.sleft[i] + this.sright[i]) / 2;
        const scy = (this.stop[i] + this.sbottom[i]) / 2;
        return [scx, scy];
    }
    _lrtb(i) {
        const l = this._left[i];
        const r = this._right[i];
        const t = this._top[i];
        const b = this._bottom[i];
        return [l, r, t, b];
    }
}
QuadView.__name__ = "QuadView";
export class Quad extends Box {
    constructor(attrs) {
        super(attrs);
    }
    static init_Quad() {
        this.prototype.default_view = QuadView;
        this.define({
            right: [p.XCoordinateSpec, { field: "right" }],
            bottom: [p.YCoordinateSpec, { field: "bottom" }],
            left: [p.XCoordinateSpec, { field: "left" }],
            top: [p.YCoordinateSpec, { field: "top" }],
        });
    }
}
Quad.__name__ = "Quad";
Quad.init_Quad();
//# sourceMappingURL=quad.js.map