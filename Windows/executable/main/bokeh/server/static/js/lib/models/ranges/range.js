import { Model } from "../../model";
import * as p from "../../core/properties";
export class Range extends Model {
    constructor(attrs) {
        super(attrs);
        this.have_updated_interactively = false;
    }
    static init_Range() {
        this.define({
            bounds: [p.Any],
            min_interval: [p.Any],
            max_interval: [p.Any],
        });
        this.internal({
            plots: [p.Array, []],
        });
    }
    get is_reversed() {
        return this.start > this.end;
    }
    get is_valid() {
        return !isNaN(this.min) && !isNaN(this.max);
    }
}
Range.__name__ = "Range";
Range.init_Range();
//# sourceMappingURL=range.js.map