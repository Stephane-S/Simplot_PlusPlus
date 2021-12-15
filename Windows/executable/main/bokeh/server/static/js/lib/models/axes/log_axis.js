import { AxisView } from "./axis";
import { ContinuousAxis } from "./continuous_axis";
import { LogTickFormatter } from "../formatters/log_tick_formatter";
import { LogTicker } from "../tickers/log_ticker";
export class LogAxisView extends AxisView {
}
LogAxisView.__name__ = "LogAxisView";
export class LogAxis extends ContinuousAxis {
    constructor(attrs) {
        super(attrs);
    }
    static init_LogAxis() {
        this.prototype.default_view = LogAxisView;
        this.override({
            ticker: () => new LogTicker(),
            formatter: () => new LogTickFormatter(),
        });
    }
}
LogAxis.__name__ = "LogAxis";
LogAxis.init_LogAxis();
//# sourceMappingURL=log_axis.js.map