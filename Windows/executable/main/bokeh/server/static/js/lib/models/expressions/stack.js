import { Expression } from "./expression";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export class Stack extends Expression {
    constructor(attrs) {
        super(attrs);
    }
    static init_Stack() {
        this.define({
            fields: [p.Array, []],
        });
    }
    _v_compute(source) {
        var _a;
        const n = (_a = source.get_length()) !== null && _a !== void 0 ? _a : 0;
        const result = new NumberArray(n);
        for (const f of this.fields) {
            const column = source.data[f];
            if (column != null) {
                for (let i = 0, k = Math.min(n, column.length); i < k; i++) {
                    result[i] += column[i];
                }
            }
        }
        return result;
    }
}
Stack.__name__ = "Stack";
Stack.init_Stack();
//# sourceMappingURL=stack.js.map