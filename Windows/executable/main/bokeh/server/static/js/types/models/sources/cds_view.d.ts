import { Model } from "../../model";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
import { Indices } from "../../core/types";
import { Filter } from "../filters/filter";
import { ColumnarDataSource } from "./columnar_data_source";
export declare namespace CDSView {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        filters: p.Property<Filter[]>;
        source: p.Property<ColumnarDataSource>;
        indices: p.Property<Indices>;
        indices_map: p.Property<{
            [key: string]: number;
        }>;
        masked: p.Property<Indices | null>;
    };
}
export interface CDSView extends CDSView.Attrs {
}
export declare class CDSView extends Model {
    properties: CDSView.Props;
    constructor(attrs?: Partial<CDSView.Attrs>);
    static init_CDSView(): void;
    initialize(): void;
    connect_signals(): void;
    compute_indices(): void;
    private _indices;
    indices_map_to_subset(): void;
    convert_selection_from_subset(selection_subset: Selection): Selection;
    convert_selection_to_subset(selection_full: Selection): Selection;
    convert_indices_from_subset(indices: number[]): number[];
}
