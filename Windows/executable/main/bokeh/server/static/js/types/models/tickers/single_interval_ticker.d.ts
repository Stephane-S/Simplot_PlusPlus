import { ContinuousTicker } from "./continuous_ticker";
import * as p from "../../core/properties";
export declare namespace SingleIntervalTicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousTicker.Props & {
        interval: p.Property<number>;
    };
}
export interface SingleIntervalTicker extends SingleIntervalTicker.Attrs {
}
export declare class SingleIntervalTicker extends ContinuousTicker {
    properties: SingleIntervalTicker.Props;
    constructor(attrs?: Partial<SingleIntervalTicker.Attrs>);
    static init_SingleIntervalTicker(): void;
    get_interval(_data_low: number, _data_high: number, _n_desired_ticks: number): number;
    get min_interval(): number;
    get max_interval(): number;
}
