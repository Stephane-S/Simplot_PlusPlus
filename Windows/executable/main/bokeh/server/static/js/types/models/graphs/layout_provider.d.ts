import { Model } from "../../model";
import { ColumnarDataSource } from "../sources/columnar_data_source";
import { Arrayable, NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace LayoutProvider {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface LayoutProvider extends LayoutProvider.Attrs {
}
export declare abstract class LayoutProvider extends Model {
    properties: LayoutProvider.Props;
    constructor(attrs?: Partial<LayoutProvider.Attrs>);
    abstract get_node_coordinates(graph_source: ColumnarDataSource): [NumberArray, NumberArray];
    abstract get_edge_coordinates(graph_source: ColumnarDataSource): [Arrayable<number>[], Arrayable<number>[]];
}
