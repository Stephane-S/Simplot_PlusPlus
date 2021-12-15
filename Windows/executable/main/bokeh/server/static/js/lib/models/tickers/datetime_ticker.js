import { range } from "../../core/util/array";
import { AdaptiveTicker } from "./adaptive_ticker";
import { CompositeTicker } from "./composite_ticker";
import { DaysTicker } from "./days_ticker";
import { MonthsTicker } from "./months_ticker";
import { YearsTicker } from "./years_ticker";
import { ONE_MILLI, ONE_SECOND, ONE_MINUTE, ONE_HOUR } from "./util";
export class DatetimeTicker extends CompositeTicker {
    constructor(attrs) {
        super(attrs);
    }
    static init_DatetimeTicker() {
        this.override({
            num_minor_ticks: 0,
            tickers: () => [
                // Sub-second.
                new AdaptiveTicker({
                    mantissas: [1, 2, 5],
                    base: 10,
                    min_interval: 0,
                    max_interval: 500 * ONE_MILLI,
                    num_minor_ticks: 0,
                }),
                // Seconds, minutes.
                new AdaptiveTicker({
                    mantissas: [1, 2, 5, 10, 15, 20, 30],
                    base: 60,
                    min_interval: ONE_SECOND,
                    max_interval: 30 * ONE_MINUTE,
                    num_minor_ticks: 0,
                }),
                // Hours.
                new AdaptiveTicker({
                    mantissas: [1, 2, 4, 6, 8, 12],
                    base: 24.0,
                    min_interval: ONE_HOUR,
                    max_interval: 12 * ONE_HOUR,
                    num_minor_ticks: 0,
                }),
                // Days.
                new DaysTicker({ days: range(1, 32) }),
                new DaysTicker({ days: range(1, 31, 3) }),
                new DaysTicker({ days: [1, 8, 15, 22] }),
                new DaysTicker({ days: [1, 15] }),
                // Months.
                new MonthsTicker({ months: range(0, 12, 1) }),
                new MonthsTicker({ months: range(0, 12, 2) }),
                new MonthsTicker({ months: range(0, 12, 4) }),
                new MonthsTicker({ months: range(0, 12, 6) }),
                // Years
                new YearsTicker({}),
            ],
        });
    }
}
DatetimeTicker.__name__ = "DatetimeTicker";
DatetimeTicker.init_DatetimeTicker();
//# sourceMappingURL=datetime_ticker.js.map