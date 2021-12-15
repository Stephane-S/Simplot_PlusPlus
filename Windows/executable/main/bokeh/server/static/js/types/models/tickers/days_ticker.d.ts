import { TickSpec } from "./ticker";
import { SingleIntervalTicker } from "./single_interval_ticker";
import * as p from "../../core/properties";
export declare namespace DaysTicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = SingleIntervalTicker.Props & {
        days: p.Property<number[]>;
    };
}
export interface DaysTicker extends DaysTicker.Attrs {
}
export declare class DaysTicker extends SingleIntervalTicker {
    properties: DaysTicker.Props;
    constructor(attrs?: Partial<DaysTicker.Attrs>);
    static init_DaysTicker(): void;
    initialize(): void;
    get_ticks_no_defaults(data_low: number, data_high: number, _cross_loc: any, _desired_n_ticks: number): TickSpec<number>;
}
