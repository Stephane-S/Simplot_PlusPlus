import { Filter } from "./filter";
import * as p from "../../core/properties";
import { Indices } from "../../core/types";
import { ColumnarDataSource } from "../sources/columnar_data_source";
export declare namespace IndexFilter {
    type Attrs = p.AttrsOf<Props>;
    type Props = Filter.Props & {
        indices: p.Property<number[] | null>;
    };
}
export interface IndexFilter extends IndexFilter.Attrs {
}
export declare class IndexFilter extends Filter {
    properties: IndexFilter.Props;
    constructor(attrs?: Partial<IndexFilter.Attrs>);
    static init_IndexFilter(): void;
    compute_indices(source: ColumnarDataSource): Indices;
}
