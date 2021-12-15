import { Ticker } from "./ticker";
export class CategoricalTicker extends Ticker {
    constructor(attrs) {
        super(attrs);
    }
    get_ticks(start, end, range, _cross_loc, _) {
        const majors = this._collect(range.factors, range, start, end);
        const tops = this._collect(range.tops || [], range, start, end);
        const mids = this._collect(range.mids || [], range, start, end);
        return {
            major: majors,
            minor: [],
            tops,
            mids,
        };
    }
    _collect(factors, range, start, end) {
        const result = [];
        for (const factor of factors) {
            const coord = range.synthetic(factor);
            if (coord > start && coord < end)
                result.push(factor);
        }
        return result;
    }
}
CategoricalTicker.__name__ = "CategoricalTicker";
//# sourceMappingURL=categorical_ticker.js.map