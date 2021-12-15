import { AxisView } from "./axis";
import { ContinuousAxis } from "./continuous_axis";
import { LogTickFormatter } from "../formatters/log_tick_formatter";
import { LogTicker } from "../tickers/log_ticker";
import * as p from "../../core/properties";
export declare class LogAxisView extends AxisView {
    model: LogAxis;
}
export declare namespace LogAxis {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousAxis.Props & {
        ticker: p.Property<LogTicker>;
        formatter: p.Property<LogTickFormatter>;
    };
}
export interface LogAxis extends LogAxis.Attrs {
}
export declare class LogAxis extends ContinuousAxis {
    properties: LogAxis.Props;
    __view_type__: LogAxisView;
    ticker: LogTicker;
    formatter: LogTickFormatter;
    constructor(attrs?: Partial<LogAxis.Attrs>);
    static init_LogAxis(): void;
}
