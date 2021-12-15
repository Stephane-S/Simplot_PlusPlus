import { Arrayable } from "./types";
import { ColumnarDataSource } from "../models/sources/columnar_data_source";
export declare type Transform<In, Out> = {
    compute(x: In): Out;
    v_compute(xs: Arrayable<In>): Arrayable<Out>;
};
export declare type Expression<Out> = {
    v_compute(source: ColumnarDataSource): Arrayable<Out>;
};
export declare type Value<T> = {
    value: T;
};
export declare type Field = {
    field: string;
};
export declare type Expr<T> = {
    expr: Expression<T>;
};
export declare type Scalar<T> = Value<T> & Transformed<T>;
export declare type Vector<T> = (Value<T> | Field | Expr<T>) & Transformed<T>;
export declare type Dimensional<T, U> = T & {
    units?: U;
};
export declare type Transformed<T> = {
    transform?: Transform<T, T>;
};
export declare function isValue<T>(obj: unknown): obj is Value<T>;
export declare function isField(obj: unknown): obj is Field;
