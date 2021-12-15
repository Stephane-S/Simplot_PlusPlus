import { ColumnarDataSource } from "../sources/columnar_data_source";
import { Expression } from "./expression";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace Stack {
    type Attrs = p.AttrsOf<Props>;
    type Props = Expression.Props & {
        fields: p.Property<string[]>;
    };
}
export interface Stack extends Stack.Attrs {
}
export declare class Stack extends Expression {
    properties: Stack.Props;
    constructor(attrs?: Partial<Stack.Attrs>);
    static init_Stack(): void;
    protected _v_compute(source: ColumnarDataSource): Arrayable<number>;
}
