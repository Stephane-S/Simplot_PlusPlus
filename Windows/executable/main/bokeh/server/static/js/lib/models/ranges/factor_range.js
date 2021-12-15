import { Range } from "./range";
import * as p from "../../core/properties";
import { NumberArray } from "../../core/types";
import { every, sum } from "../../core/util/array";
import { isArray, isNumber, isString } from "../../core/util/types";
import { unreachable } from "../../core/util/assert";
export function map_one_level(factors, padding, offset = 0) {
    const mapping = new Map();
    for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];
        if (!mapping.has(factor))
            mapping.set(factor, { value: 0.5 + i * (1 + padding) + offset });
        else
            throw new Error(`duplicate factor or subfactor: ${factor}`);
    }
    return [mapping, (factors.length - 1) * padding];
}
export function map_two_levels(factors, outer_pad, factor_pad, offset = 0) {
    var _a;
    const mapping = new Map();
    const tops = new Map();
    for (const [f0, f1] of factors) {
        const top = (_a = tops.get(f0)) !== null && _a !== void 0 ? _a : [];
        tops.set(f0, [...top, f1]);
    }
    let suboffset = offset;
    let total_subpad = 0;
    for (const [f0, top] of tops) {
        const n = top.length;
        const [submap, subpad] = map_one_level(top, factor_pad, suboffset);
        total_subpad += subpad;
        const subtot = sum(top.map((f1) => submap.get(f1).value));
        mapping.set(f0, { value: subtot / n, mapping: submap });
        suboffset += n + outer_pad + subpad;
    }
    return [mapping, (tops.size - 1) * outer_pad + total_subpad];
}
export function map_three_levels(factors, outer_pad, inner_pad, factor_pad, offset = 0) {
    var _a;
    const mapping = new Map();
    const tops = new Map();
    for (const [f0, f1, f2] of factors) {
        const top = (_a = tops.get(f0)) !== null && _a !== void 0 ? _a : [];
        tops.set(f0, [...top, [f1, f2]]);
    }
    let suboffset = offset;
    let total_subpad = 0;
    for (const [f0, top] of tops) {
        const n = top.length;
        const [submap, subpad] = map_two_levels(top, inner_pad, factor_pad, suboffset);
        total_subpad += subpad;
        const subtot = sum(top.map(([f1]) => submap.get(f1).value));
        mapping.set(f0, { value: subtot / n, mapping: submap });
        suboffset += n + outer_pad + subpad;
    }
    return [mapping, (tops.size - 1) * outer_pad + total_subpad];
}
export class FactorRange extends Range {
    constructor(attrs) {
        super(attrs);
    }
    static init_FactorRange() {
        this.define({
            factors: [p.Array, []],
            factor_padding: [p.Number, 0],
            subgroup_padding: [p.Number, 0.8],
            group_padding: [p.Number, 1.4],
            range_padding: [p.Number, 0],
            range_padding_units: [p.PaddingUnits, "percent"],
            start: [p.Number],
            end: [p.Number],
        });
        this.internal({
            levels: [p.Number],
            mids: [p.Array, null],
            tops: [p.Array, null],
        });
    }
    get min() {
        return this.start;
    }
    get max() {
        return this.end;
    }
    initialize() {
        super.initialize();
        this._init(true);
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.properties.factors.change, () => this.reset());
        this.connect(this.properties.factor_padding.change, () => this.reset());
        this.connect(this.properties.group_padding.change, () => this.reset());
        this.connect(this.properties.subgroup_padding.change, () => this.reset());
        this.connect(this.properties.range_padding.change, () => this.reset());
        this.connect(this.properties.range_padding_units.change, () => this.reset());
    }
    reset() {
        this._init(false);
        this.change.emit();
    }
    _lookup(x) {
        switch (x.length) {
            case 1: {
                const [f0] = x;
                const mapping = this._mapping;
                const y0 = mapping.get(f0);
                return y0 != null ? y0.value : NaN;
            }
            case 2: {
                const [f0, f1] = x;
                const mapping = this._mapping;
                const y0 = mapping.get(f0);
                if (y0 != null) {
                    const y1 = y0.mapping.get(f1);
                    if (y1 != null)
                        return y1.value;
                }
                return NaN;
            }
            case 3: {
                const [f0, f1, f2] = x;
                const mapping = this._mapping;
                const y0 = mapping.get(f0);
                if (y0 != null) {
                    const y1 = y0.mapping.get(f1);
                    if (y1 != null) {
                        const y2 = y1.mapping.get(f2);
                        if (y2 != null)
                            return y2.value;
                    }
                }
                return NaN;
            }
            default:
                unreachable();
        }
    }
    // convert a string factor into a synthetic coordinate
    synthetic(x) {
        if (isNumber(x))
            return x;
        if (isString(x))
            return this._lookup([x]);
        let offset = 0;
        const off = x[x.length - 1];
        if (isNumber(off)) {
            offset = off;
            x = x.slice(0, -1);
        }
        return this._lookup(x) + offset;
    }
    // convert an array of string factors into synthetic coordinates
    v_synthetic(xs) {
        const n = xs.length;
        const array = new NumberArray(n);
        for (let i = 0; i < n; i++) {
            array[i] = this.synthetic(xs[i]);
        }
        return array;
    }
    _init(silent) {
        const { levels, mapping, tops, mids, inside_padding } = (() => {
            if (every(this.factors, isString)) {
                const factors = this.factors;
                const [mapping, inside_padding] = map_one_level(factors, this.factor_padding);
                const tops = null;
                const mids = null;
                return { levels: 1, mapping, tops, mids, inside_padding };
            }
            else if (every(this.factors, (x) => isArray(x) && x.length == 2 && isString(x[0]) && isString(x[1]))) {
                const factors = this.factors;
                const [mapping, inside_padding] = map_two_levels(factors, this.group_padding, this.factor_padding);
                const tops = [...mapping.keys()];
                const mids = null;
                return { levels: 2, mapping, tops, mids, inside_padding };
            }
            else if (every(this.factors, (x) => isArray(x) && x.length == 3 && isString(x[0]) && isString(x[1]) && isString(x[2]))) {
                const factors = this.factors;
                const [mapping, inside_padding] = map_three_levels(factors, this.group_padding, this.subgroup_padding, this.factor_padding);
                const tops = [...mapping.keys()];
                const mids = [];
                for (const [f0, L2] of mapping) {
                    for (const f1 of L2.mapping.keys()) {
                        mids.push([f0, f1]);
                    }
                }
                return { levels: 3, mapping, tops, mids, inside_padding };
            }
            else
                unreachable();
        })();
        this._mapping = mapping;
        this.tops = tops;
        this.mids = mids;
        let start = 0;
        let end = this.factors.length + inside_padding;
        if (this.range_padding_units == "percent") {
            const half_span = (end - start) * this.range_padding / 2;
            start -= half_span;
            end += half_span;
        }
        else {
            start -= this.range_padding;
            end += this.range_padding;
        }
        this.setv({ start, end, levels }, { silent });
        if (this.bounds == "auto")
            this.setv({ bounds: [start, end] }, { silent: true });
    }
}
FactorRange.__name__ = "FactorRange";
FactorRange.init_FactorRange();
//# sourceMappingURL=factor_range.js.map