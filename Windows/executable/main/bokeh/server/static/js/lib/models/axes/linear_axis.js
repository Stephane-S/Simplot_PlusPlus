import { AxisView } from "./axis";
import { ContinuousAxis } from "./continuous_axis";
import { BasicTickFormatter } from "../formatters/basic_tick_formatter";
import { BasicTicker } from "../tickers/basic_ticker";
export class LinearAxisView extends AxisView {
}
LinearAxisView.__name__ = "LinearAxisView";
export class LinearAxis extends ContinuousAxis {
    constructor(attrs) {
        super(attrs);
    }
    static init_LinearAxis() {
        this.prototype.default_view = LinearAxisView;
        this.override({
            ticker: () => new BasicTicker(),
            formatter: () => new BasicTickFormatter(),
        });
    }
}
LinearAxis.__name__ = "LinearAxis";
LinearAxis.init_LinearAxis();
//# sourceMappingURL=linear_axis.js.map