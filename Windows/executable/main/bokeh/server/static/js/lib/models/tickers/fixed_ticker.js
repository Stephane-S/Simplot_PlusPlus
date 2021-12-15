import { ContinuousTicker } from "./continuous_ticker";
import * as p from "../../core/properties";
export class FixedTicker extends ContinuousTicker {
    constructor(attrs) {
        super(attrs);
        this.min_interval = 0;
        this.max_interval = 0;
    }
    static init_FixedTicker() {
        this.define({
            ticks: [p.Array, []],
            minor_ticks: [p.Array, []],
        });
    }
    get_ticks_no_defaults(_data_low, _data_high, _cross_loc, _desired_n_ticks) {
        return {
            major: this.ticks,
            minor: this.minor_ticks,
        };
    }
    // XXX: whatever, because FixedTicker needs to fulfill the interface somehow
    get_interval(_data_low, _data_high, _desired_n_ticks) {
        return 0;
    }
}
FixedTicker.__name__ = "FixedTicker";
FixedTicker.init_FixedTicker();
//# sourceMappingURL=fixed_ticker.js.map