import { Ticker, TickSpec } from "./ticker";
import * as p from "../../core/properties";
export declare namespace ContinuousTicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = Ticker.Props & {
        num_minor_ticks: p.Property<number>;
        desired_num_ticks: p.Property<number>;
    };
}
export interface ContinuousTicker extends ContinuousTicker.Attrs {
}
export declare abstract class ContinuousTicker extends Ticker<number> {
    properties: ContinuousTicker.Props;
    constructor(attrs?: Partial<ContinuousTicker.Attrs>);
    static init_ContinuousTicker(): void;
    min_interval: number;
    max_interval: number;
    get_ticks(data_low: number, data_high: number, _range: any, cross_loc: any, _: any): TickSpec<number>;
    abstract get_interval(data_low: number, data_high: number, desired_n_ticks: number): number;
    get_ticks_no_defaults(data_low: number, data_high: number, _cross_loc: any, desired_n_ticks: number): TickSpec<number>;
    get_min_interval(): number;
    get_max_interval(): number;
    get_ideal_interval(data_low: number, data_high: number, desired_n_ticks: number): number;
}
