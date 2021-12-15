import { RangeTransform } from "./range_transform";
import { Factor } from "../ranges/factor_range";
import { Distribution } from "../../core/enums";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace Jitter {
    type Attrs = p.AttrsOf<Props>;
    type Props = RangeTransform.Props & {
        mean: p.Property<number>;
        width: p.Property<number>;
        distribution: p.Property<Distribution>;
    };
}
export interface Jitter extends Jitter.Attrs {
}
export declare class Jitter extends RangeTransform {
    properties: Jitter.Props;
    previous_values: Arrayable<number>;
    constructor(attrs?: Partial<Jitter.Attrs>);
    static init_Jitter(): void;
    v_compute(xs0: Arrayable<number | Factor>): Arrayable<number>;
    protected _compute(x: number): number;
}
