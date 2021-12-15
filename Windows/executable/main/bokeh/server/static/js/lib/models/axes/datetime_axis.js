import { LinearAxis, LinearAxisView } from "./linear_axis";
import { DatetimeTickFormatter } from "../formatters/datetime_tick_formatter";
import { DatetimeTicker } from "../tickers/datetime_ticker";
export class DatetimeAxisView extends LinearAxisView {
}
DatetimeAxisView.__name__ = "DatetimeAxisView";
export class DatetimeAxis extends LinearAxis {
    constructor(attrs) {
        super(attrs);
    }
    static init_DatetimeAxis() {
        this.prototype.default_view = DatetimeAxisView;
        this.override({
            ticker: () => new DatetimeTicker(),
            formatter: () => new DatetimeTickFormatter(),
        });
    }
}
DatetimeAxis.__name__ = "DatetimeAxis";
DatetimeAxis.init_DatetimeAxis();
//# sourceMappingURL=datetime_axis.js.map