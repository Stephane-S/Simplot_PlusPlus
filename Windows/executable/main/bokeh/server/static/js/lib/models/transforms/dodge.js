import { RangeTransform } from "./range_transform";
import * as p from "../../core/properties";
export class Dodge extends RangeTransform {
    constructor(attrs) {
        super(attrs);
    }
    static init_Dodge() {
        this.define({
            value: [p.Number, 0],
        });
    }
    _compute(x) {
        return x + this.value;
    }
}
Dodge.__name__ = "Dodge";
Dodge.init_Dodge();
//# sourceMappingURL=dodge.js.map