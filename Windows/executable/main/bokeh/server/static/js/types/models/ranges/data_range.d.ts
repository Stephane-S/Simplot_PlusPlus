import { Range } from "./range";
import { Renderer } from "../renderers/renderer";
import * as p from "../../core/properties";
export declare namespace DataRange {
    type Attrs = p.AttrsOf<Props>;
    type Props = Range.Props & {
        names: p.Property<string[]>;
        renderers: p.Property<Renderer[]>;
    };
}
export interface DataRange extends DataRange.Attrs {
}
export declare abstract class DataRange extends Range {
    properties: DataRange.Props;
    constructor(attrs?: Partial<DataRange.Attrs>);
    static init_DataRange(): void;
}
