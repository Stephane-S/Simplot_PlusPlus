import { ContinuousScale } from "./continuous_scale";
import { Arrayable, NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace LogScale {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousScale.Props;
}
export interface LogScale extends LogScale.Attrs {
}
export declare class LogScale extends ContinuousScale {
    properties: LogScale.Props;
    constructor(attrs?: Partial<LogScale.Attrs>);
    compute(x: number): number;
    v_compute(xs: Arrayable<number>): NumberArray;
    invert(xprime: number): number;
    v_invert(xprimes: Arrayable<number>): NumberArray;
    protected _get_safe_factor(orig_start: number, orig_end: number): [number, number];
    _compute_state(): [number, number, number, number];
}
