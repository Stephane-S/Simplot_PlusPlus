import { SingleIntervalTicker } from "./single_interval_ticker";
import { copy_date, last_year_no_later_than, ONE_MONTH } from "./util";
import * as p from "../../core/properties";
import { concat } from "../../core/util/array";
// Given a start and end time in millis, returns the shortest array of
// consecutive years (as Dates) that surrounds both times.
function date_range_by_year(start_time, end_time) {
    const start_date = last_year_no_later_than(new Date(start_time));
    const end_date = last_year_no_later_than(new Date(end_time));
    end_date.setUTCFullYear(end_date.getUTCFullYear() + 1);
    const dates = [];
    const date = start_date;
    while (true) {
        dates.push(copy_date(date));
        date.setUTCFullYear(date.getUTCFullYear() + 1);
        if (date > end_date)
            break;
    }
    return dates;
}
export class MonthsTicker extends SingleIntervalTicker {
    constructor(attrs) {
        super(attrs);
    }
    static init_MonthsTicker() {
        this.define({
            months: [p.Array, []],
        });
    }
    initialize() {
        super.initialize();
        const months = this.months;
        if (months.length > 1)
            this.interval = (months[1] - months[0]) * ONE_MONTH;
        else
            this.interval = 12 * ONE_MONTH;
    }
    get_ticks_no_defaults(data_low, data_high, _cross_loc, _desired_n_ticks) {
        const year_dates = date_range_by_year(data_low, data_high);
        const months = this.months;
        const months_of_year = (year_date) => {
            return months.map((month) => {
                const month_date = copy_date(year_date);
                month_date.setUTCMonth(month);
                return month_date;
            });
        };
        const month_dates = concat(year_dates.map(months_of_year));
        const all_ticks = month_dates.map((month_date) => month_date.getTime());
        const ticks_in_range = all_ticks.filter((tick) => data_low <= tick && tick <= data_high);
        return {
            major: ticks_in_range,
            minor: [],
        };
    }
}
MonthsTicker.__name__ = "MonthsTicker";
MonthsTicker.init_MonthsTicker();
//# sourceMappingURL=months_ticker.js.map