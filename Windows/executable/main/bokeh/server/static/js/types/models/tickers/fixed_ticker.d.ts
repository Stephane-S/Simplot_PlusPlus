import { TickSpec } from "./ticker";
import { ContinuousTicker } from "./continuous_ticker";
import * as p from "../../core/properties";
export declare namespace FixedTicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousTicker.Props & {
        ticks: p.Property<number[]>;
        minor_ticks: p.Property<number[]>;
    };
}
export interface FixedTicker extends FixedTicker.Attrs {
}
export declare class FixedTicker extends ContinuousTicker {
    properties: FixedTicker.Props;
    constructor(attrs?: Partial<FixedTicker.Attrs>);
    static init_FixedTicker(): void;
    get_ticks_no_defaults(_data_low: number, _data_high: number, _cross_loc: any, _desired_n_ticks: number): TickSpec<number>;
    get_interval(_data_low: number, _data_high: number, _desired_n_ticks: number): number;
    min_interval: number;
    max_interval: number;
}
