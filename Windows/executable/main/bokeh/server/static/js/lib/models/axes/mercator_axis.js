import { AxisView } from "./axis";
import { LinearAxis } from "./linear_axis";
import { MercatorTickFormatter } from "../formatters/mercator_tick_formatter";
import { MercatorTicker } from "../tickers/mercator_ticker";
export class MercatorAxisView extends AxisView {
}
MercatorAxisView.__name__ = "MercatorAxisView";
export class MercatorAxis extends LinearAxis {
    constructor(attrs) {
        super(attrs);
    }
    static init_MercatorAxis() {
        this.prototype.default_view = MercatorAxisView;
        this.override({
            ticker: () => new MercatorTicker({ dimension: "lat" }),
            formatter: () => new MercatorTickFormatter({ dimension: "lat" }),
        });
    }
}
MercatorAxis.__name__ = "MercatorAxis";
MercatorAxis.init_MercatorAxis();
//# sourceMappingURL=mercator_axis.js.map