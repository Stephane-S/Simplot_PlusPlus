import { Expression } from "./expression";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export class CumSum extends Expression {
    constructor(attrs) {
        super(attrs);
    }
    static init_CumSum() {
        this.define({
            field: [p.String],
            include_zero: [p.Boolean, false],
        });
    }
    _v_compute(source) {
        const result = new NumberArray(source.get_length() || 0);
        const col = source.data[this.field];
        const offset = this.include_zero ? 1 : 0;
        result[0] = this.include_zero ? 0 : col[0];
        for (let i = 1; i < result.length; i++) {
            result[i] = result[i - 1] + col[i - offset];
        }
        return result;
    }
}
CumSum.__name__ = "CumSum";
CumSum.init_CumSum();
//# sourceMappingURL=cumsum.js.map