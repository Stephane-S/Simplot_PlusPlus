import { RangeTransform } from "./range_transform";
import * as p from "../../core/properties";
import * as bokeh_math from "../../core/util/math";
export class Jitter extends RangeTransform {
    constructor(attrs) {
        super(attrs);
    }
    static init_Jitter() {
        this.define({
            mean: [p.Number, 0],
            width: [p.Number, 1],
            distribution: [p.Distribution, 'uniform'],
        });
    }
    v_compute(xs0) {
        if (this.previous_values != null && this.previous_values.length == xs0.length)
            return this.previous_values;
        this.previous_values = super.v_compute(xs0);
        return this.previous_values;
    }
    _compute(x) {
        switch (this.distribution) {
            case "uniform":
                return x + this.mean + (bokeh_math.random() - 0.5) * this.width;
            case "normal":
                return x + bokeh_math.rnorm(this.mean, this.width);
        }
    }
}
Jitter.__name__ = "Jitter";
Jitter.init_Jitter();
//# sourceMappingURL=jitter.js.map