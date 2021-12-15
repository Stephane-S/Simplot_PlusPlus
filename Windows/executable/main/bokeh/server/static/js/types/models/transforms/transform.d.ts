import { Model } from "../../model";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace Transform {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface Transform<To = number> extends Transform.Attrs {
}
export declare abstract class Transform<To = number> extends Model {
    properties: Transform.Props;
    constructor(attrs?: Partial<Transform.Attrs>);
    abstract compute(x: number): To;
    abstract v_compute(xs: Arrayable<number>): Arrayable<To>;
}
