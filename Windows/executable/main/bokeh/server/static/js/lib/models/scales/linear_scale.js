import { ContinuousScale } from "./continuous_scale";
import * as p from "../../core/properties";
export class LinearScale extends ContinuousScale {
    constructor(attrs) {
        super(attrs);
    }
    static init_LinearScale() {
        this.internal({ scan_result: [p.Any] });
    }
    compute(x) {
        return this._linear_compute(x);
    }
    v_compute(xs) {
        return this._linear_v_compute(xs);
    }
    invert(xprime) {
        return this._linear_invert(xprime);
    }
    v_invert(xprimes) {
        return this._linear_v_invert(xprimes);
    }
}
LinearScale.__name__ = "LinearScale";
LinearScale.init_LinearScale();
//# sourceMappingURL=linear_scale.js.map