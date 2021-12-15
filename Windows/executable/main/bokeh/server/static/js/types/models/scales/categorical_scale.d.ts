import { Scale } from "./scale";
import { FactorRange } from "../ranges/factor_range";
import { Arrayable, NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace CategoricalScale {
    type Attrs = p.AttrsOf<Props>;
    type Props = Scale.Props;
}
export interface CategoricalScale extends CategoricalScale.Attrs {
}
export declare class CategoricalScale extends Scale {
    properties: CategoricalScale.Props;
    constructor(attrs?: Partial<CategoricalScale.Attrs>);
    source_range: FactorRange;
    compute(x: any): number;
    v_compute(xs: Arrayable<any>): NumberArray;
    invert(xprime: number): number;
    v_invert(xprimes: Arrayable<number>): NumberArray;
}
