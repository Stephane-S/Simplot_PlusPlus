import { Scale } from "./scale";
import { NumberArray } from "../../core/types";
import { linspace } from "../../core/util/array";
import { interpolate, norm, map } from "../../core/util/arrayable";
import * as p from "../../core/properties";
export class LinearInterpolationScale extends Scale {
    constructor(attrs) {
        super(attrs);
    }
    static init_LinearInterpolationScale() {
        this.internal({ binning: [p.Array] });
    }
    compute(x) {
        return x;
    }
    v_compute(xs) {
        const norm_xs = norm(xs, this.source_range.start, this.source_range.end);
        const edges_norm = linspace(0, 1, this.binning.length);
        const interpolated = interpolate(norm_xs, edges_norm, this.binning);
        const norm_interp = norm(interpolated, this.source_range.start, this.source_range.end);
        const target_span = this.target_range.end - this.target_range.start;
        const sxs = map(norm_interp, (x) => this.target_range.start + x * target_span);
        return new NumberArray(sxs);
    }
    invert(xprime) {
        return xprime;
    }
    v_invert(xprimes) {
        return new NumberArray(xprimes);
    }
}
LinearInterpolationScale.__name__ = "LinearInterpolationScale";
LinearInterpolationScale.init_LinearInterpolationScale();
//# sourceMappingURL=linear_interpolation_scale.js.map