import { Axis } from "./axis";
import * as p from "../../core/properties";
export declare namespace ContinuousAxis {
    type Attrs = p.AttrsOf<Props>;
    type Props = Axis.Props;
}
export interface ContinuousAxis extends ContinuousAxis.Attrs {
}
export declare abstract class ContinuousAxis extends Axis {
    properties: ContinuousAxis.Props;
    constructor(attrs?: Partial<ContinuousAxis.Attrs>);
}
