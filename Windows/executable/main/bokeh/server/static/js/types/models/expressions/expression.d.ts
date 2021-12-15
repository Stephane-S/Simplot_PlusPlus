import { ColumnarDataSource } from "../sources/columnar_data_source";
import { Model } from "../../model";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace Expression {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface Expression extends Expression.Attrs {
}
export declare abstract class Expression extends Model {
    properties: Expression.Props;
    constructor(attrs?: Partial<Expression.Attrs>);
    protected _connected: Set<ColumnarDataSource>;
    protected _result: Map<ColumnarDataSource, Arrayable>;
    initialize(): void;
    protected abstract _v_compute(source: ColumnarDataSource): Arrayable;
    v_compute(source: ColumnarDataSource): Arrayable;
}
