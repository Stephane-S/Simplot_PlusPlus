import { ContinuousTicker } from "./continuous_ticker";
import * as p from "../../core/properties";
export class SingleIntervalTicker extends ContinuousTicker {
    constructor(attrs) {
        super(attrs);
    }
    static init_SingleIntervalTicker() {
        this.define({
            interval: [p.Number],
        });
    }
    get_interval(_data_low, _data_high, _n_desired_ticks) {
        return this.interval;
    }
    get min_interval() {
        return this.interval;
    }
    get max_interval() {
        return this.interval;
    }
}
SingleIntervalTicker.__name__ = "SingleIntervalTicker";
SingleIntervalTicker.init_SingleIntervalTicker();
//# sourceMappingURL=single_interval_ticker.js.map