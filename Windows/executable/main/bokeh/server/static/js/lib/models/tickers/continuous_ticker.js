import { Ticker } from "./ticker";
import * as p from "../../core/properties";
import { range } from "../../core/util/array";
export class ContinuousTicker extends Ticker {
    constructor(attrs) {
        super(attrs);
    }
    static init_ContinuousTicker() {
        this.define({
            num_minor_ticks: [p.Number, 5],
            desired_num_ticks: [p.Number, 6],
        });
    }
    get_ticks(data_low, data_high, _range, cross_loc, _) {
        return this.get_ticks_no_defaults(data_low, data_high, cross_loc, this.desired_num_ticks);
    }
    // The version of get_ticks() that does the work (and the version that
    // should be overridden in subclasses).
    get_ticks_no_defaults(data_low, data_high, _cross_loc, desired_n_ticks) {
        const interval = this.get_interval(data_low, data_high, desired_n_ticks);
        const start_factor = Math.floor(data_low / interval);
        const end_factor = Math.ceil(data_high / interval);
        let factors;
        if (!isFinite(start_factor) || !isFinite(end_factor))
            factors = [];
        else
            factors = range(start_factor, end_factor + 1);
        const ticks = factors
            .map((factor) => factor * interval)
            .filter((tick) => data_low <= tick && tick <= data_high);
        const num_minor_ticks = this.num_minor_ticks;
        const minor_ticks = [];
        if (num_minor_ticks > 0 && ticks.length > 0) {
            const minor_interval = interval / num_minor_ticks;
            const minor_offsets = range(0, num_minor_ticks).map((i) => i * minor_interval);
            for (const x of minor_offsets.slice(1)) {
                const mt = ticks[0] - x;
                if (data_low <= mt && mt <= data_high) {
                    minor_ticks.push(mt);
                }
            }
            for (const tick of ticks) {
                for (const x of minor_offsets) {
                    const mt = tick + x;
                    if (data_low <= mt && mt <= data_high) {
                        minor_ticks.push(mt);
                    }
                }
            }
        }
        return {
            major: ticks,
            minor: minor_ticks,
        };
    }
    // Returns the smallest interval that can be returned by get_interval().
    get_min_interval() {
        return this.min_interval;
    }
    // Returns the largest interval that can be returned by get_interval().
    get_max_interval() {
        return this.max_interval != null ? this.max_interval : Infinity;
    }
    // Returns the interval size that would produce exactly the number of
    // desired ticks.  (In general we won't use exactly this interval, because
    // we want the ticks to be round numbers.)
    get_ideal_interval(data_low, data_high, desired_n_ticks) {
        const data_range = data_high - data_low;
        return data_range / desired_n_ticks;
    }
}
ContinuousTicker.__name__ = "ContinuousTicker";
ContinuousTicker.init_ContinuousTicker();
//# sourceMappingURL=continuous_ticker.js.map