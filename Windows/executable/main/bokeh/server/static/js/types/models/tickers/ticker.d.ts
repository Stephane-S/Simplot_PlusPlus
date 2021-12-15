import { Model } from "../../model";
import * as p from "../../core/properties";
export declare type TickSpec<T> = {
    major: T[];
    minor: T[];
};
export declare namespace Ticker {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface Ticker<T> extends Ticker.Attrs {
}
export declare abstract class Ticker<T> extends Model {
    properties: Ticker.Props;
    constructor(attrs?: Partial<Ticker.Attrs>);
    abstract get_ticks(data_low: number, data_high: number, range: any, cross_loc: any, unused: any): TickSpec<T>;
}
