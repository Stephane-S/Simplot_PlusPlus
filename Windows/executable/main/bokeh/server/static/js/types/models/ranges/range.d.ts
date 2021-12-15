import { Model } from "../../model";
import { Plot } from "../plots/plot";
import * as p from "../../core/properties";
export declare namespace Range {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        bounds: p.Property<[number, number] | "auto" | null>;
        min_interval: p.Property<number>;
        max_interval: p.Property<number>;
        plots: p.Property<Plot[]>;
    };
}
export interface Range extends Range.Attrs {
}
export declare abstract class Range extends Model {
    properties: Range.Props;
    constructor(attrs?: Partial<Range.Attrs>);
    static init_Range(): void;
    start: number;
    end: number;
    min: number;
    max: number;
    have_updated_interactively: boolean;
    abstract reset(): void;
    get is_reversed(): boolean;
    get is_valid(): boolean;
}
