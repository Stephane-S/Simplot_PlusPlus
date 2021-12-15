import { TickFormatter } from "./tick_formatter";
import { BasicTickFormatter } from "./basic_tick_formatter";
import * as p from "../../core/properties";
export class LogTickFormatter extends TickFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_LogTickFormatter() {
        this.define({
            ticker: [p.Instance, null],
        });
    }
    initialize() {
        super.initialize();
        this.basic_formatter = new BasicTickFormatter();
    }
    doFormat(ticks, opts) {
        if (ticks.length == 0)
            return [];
        const base = this.ticker != null ? this.ticker.base : 10;
        let small_interval = false;
        const labels = new Array(ticks.length);
        for (let i = 0, end = ticks.length; i < end; i++) {
            labels[i] = `${base}^${Math.round(Math.log(ticks[i]) / Math.log(base))}`;
            if (i > 0 && labels[i] == labels[i - 1]) {
                small_interval = true;
                break;
            }
        }
        if (small_interval)
            return this.basic_formatter.doFormat(ticks, opts);
        else
            return labels;
    }
}
LogTickFormatter.__name__ = "LogTickFormatter";
LogTickFormatter.init_LogTickFormatter();
//# sourceMappingURL=log_tick_formatter.js.map