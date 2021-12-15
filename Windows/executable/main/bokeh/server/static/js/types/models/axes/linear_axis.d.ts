import { AxisView } from "./axis";
import { ContinuousAxis } from "./continuous_axis";
import { BasicTickFormatter } from "../formatters/basic_tick_formatter";
import { BasicTicker } from "../tickers/basic_ticker";
import * as p from "../../core/properties";
export declare class LinearAxisView extends AxisView {
    model: LinearAxis;
}
export declare namespace LinearAxis {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousAxis.Props & {
        ticker: p.Property<BasicTicker>;
        formatters: p.Property<BasicTickFormatter>;
    };
}
export interface LinearAxis extends LinearAxis.Attrs {
}
export declare class LinearAxis extends ContinuousAxis {
    properties: LinearAxis.Props;
    __view_type__: LinearAxisView;
    ticker: BasicTicker;
    formatters: BasicTickFormatter;
    constructor(attrs?: Partial<LinearAxis.Attrs>);
    static init_LinearAxis(): void;
}
