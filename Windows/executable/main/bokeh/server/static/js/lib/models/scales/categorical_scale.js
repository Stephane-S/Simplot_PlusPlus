import { Scale } from "./scale";
export class CategoricalScale extends Scale {
    constructor(attrs) {
        super(attrs);
    }
    compute(x) {
        return super._linear_compute(this.source_range.synthetic(x));
    }
    v_compute(xs) {
        return super._linear_v_compute(this.source_range.v_synthetic(xs));
    }
    invert(xprime) {
        return this._linear_invert(xprime);
    }
    v_invert(xprimes) {
        return this._linear_v_invert(xprimes);
    }
}
CategoricalScale.__name__ = "CategoricalScale";
//# sourceMappingURL=categorical_scale.js.map