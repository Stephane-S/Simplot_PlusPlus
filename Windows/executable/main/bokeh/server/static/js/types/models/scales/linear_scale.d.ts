import { ContinuousScale } from "./continuous_scale";
import { Arrayable, NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace LinearScale {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousScale.Props;
}
export interface LinearScale extends LinearScale.Attrs {
}
export declare class LinearScale extends ContinuousScale {
    properties: LinearScale.Props;
    constructor(attrs?: Partial<LinearScale.Attrs>);
    static init_LinearScale(): void;
    compute(x: number): number;
    v_compute(xs: Arrayable<number>): NumberArray;
    invert(xprime: number): number;
    v_invert(xprimes: Arrayable<number>): NumberArray;
}
