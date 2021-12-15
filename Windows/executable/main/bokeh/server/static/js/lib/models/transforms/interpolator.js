import { Transform } from "./transform";
import * as p from "../../core/properties";
import { NumberArray } from "../../core/types";
import { includes } from "../../core/util/array";
import { isString, isArray } from "../../core/util/types";
export class Interpolator extends Transform {
    constructor(attrs) {
        super(attrs);
        this._sorted_dirty = true;
    }
    static init_Interpolator() {
        this.define({
            x: [p.Any],
            y: [p.Any],
            data: [p.Any],
            clip: [p.Boolean, true],
        });
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.change, () => this._sorted_dirty = true);
    }
    v_compute(xs) {
        const result = new NumberArray(xs.length);
        for (let i = 0; i < xs.length; i++) {
            const x = xs[i];
            result[i] = this.compute(x);
        }
        return result;
    }
    sort(descending = false) {
        if (!this._sorted_dirty)
            return;
        let tsx;
        let tsy;
        if (isString(this.x) && isString(this.y) && this.data != null) {
            const column_names = this.data.columns();
            if (!includes(column_names, this.x))
                throw new Error("The x parameter does not correspond to a valid column name defined in the data parameter");
            if (!includes(column_names, this.y))
                throw new Error("The y parameter does not correspond to a valid column name defined in the data parameter");
            tsx = this.data.get_column(this.x);
            tsy = this.data.get_column(this.y);
        }
        else if (isArray(this.x) && isArray(this.y)) {
            tsx = this.x;
            tsy = this.y;
        }
        else {
            throw new Error("parameters 'x' and 'y' must be both either string fields or arrays");
        }
        if (tsx.length !== tsy.length)
            throw new Error("The length for x and y do not match");
        if (tsx.length < 2)
            throw new Error("x and y must have at least two elements to support interpolation");
        const n = tsx.length;
        const index = new Uint32Array(n);
        for (let i = 0; i < n; i++) {
            index[i] = i;
        }
        const sign = descending ? -1 : 1;
        index.sort((i, j) => sign * (tsx[i] - tsx[j]));
        this._x_sorted = new NumberArray(n);
        this._y_sorted = new NumberArray(n);
        for (let i = 0; i < n; i++) {
            this._x_sorted[i] = tsx[index[i]];
            this._y_sorted[i] = tsy[index[i]];
        }
        this._sorted_dirty = false;
    }
}
Interpolator.__name__ = "Interpolator";
Interpolator.init_Interpolator();
//# sourceMappingURL=interpolator.js.map