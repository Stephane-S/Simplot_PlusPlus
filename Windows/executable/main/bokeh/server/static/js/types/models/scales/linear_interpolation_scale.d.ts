import { Scale } from "./scale";
import { Arrayable, NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace LinearInterpolationScale {
    type Attrs = p.AttrsOf<Props>;
    type Props = Scale.Props & {
        binning: p.Property<Arrayable<number>>;
    };
}
export interface LinearInterpolationScale extends LinearInterpolationScale.Attrs {
}
export declare class LinearInterpolationScale extends Scale {
    properties: LinearInterpolationScale.Props;
    constructor(attrs?: Partial<LinearInterpolationScale.Attrs>);
    static init_LinearInterpolationScale(): void;
    compute(x: number): number;
    v_compute(xs: Arrayable<number>): NumberArray;
    invert(xprime: number): number;
    v_invert(xprimes: Arrayable<number>): NumberArray;
}
