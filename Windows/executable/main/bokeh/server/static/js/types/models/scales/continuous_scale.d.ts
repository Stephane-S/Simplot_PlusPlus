import { Scale } from "./scale";
import * as p from "../../core/properties";
export declare namespace ContinuousScale {
    type Attrs = p.AttrsOf<Props>;
    type Props = Scale.Props;
}
export interface ContinuousScale extends ContinuousScale.Attrs {
}
export declare abstract class ContinuousScale extends Scale {
    properties: ContinuousScale.Props;
    constructor(attrs?: Partial<ContinuousScale.Attrs>);
}
