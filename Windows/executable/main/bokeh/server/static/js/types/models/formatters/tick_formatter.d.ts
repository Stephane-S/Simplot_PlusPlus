import { Model } from "../../model";
import * as p from "../../core/properties";
export declare namespace TickFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface TickFormatter extends TickFormatter.Attrs {
}
export declare abstract class TickFormatter extends Model {
    properties: TickFormatter.Props;
    constructor(attrs?: Partial<TickFormatter.Attrs>);
    abstract doFormat(ticks: string[] | number[], opts: {
        loc: number;
    }): string[];
}
