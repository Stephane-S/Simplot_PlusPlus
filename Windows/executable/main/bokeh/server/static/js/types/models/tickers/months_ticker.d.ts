import { TickSpec } from "./ticker";
import { SingleIntervalTicker } from "./single_interval_ticker";
import * as p from "../../core/properties";
export declare namespace MonthsTicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = SingleIntervalTicker.Props & {
        months: p.Property<number[]>;
    };
}
export interface MonthsTicker extends MonthsTicker.Attrs {
}
export declare class MonthsTicker extends SingleIntervalTicker {
    properties: MonthsTicker.Props;
    constructor(attrs?: Partial<MonthsTicker.Attrs>);
    static init_MonthsTicker(): void;
    initialize(): void;
    get_ticks_no_defaults(data_low: number, data_high: number, _cross_loc: any, _desired_n_ticks: number): TickSpec<number>;
}
