import { ColumnarDataSource } from "./columnar_data_source";
import { Arrayable, Data } from "../../core/types";
import * as p from "../../core/properties";
import { NDArray } from "../../core/util/ndarray";
export declare function stream_to_column(col: Arrayable, new_col: Arrayable, rollover?: number): Arrayable;
export declare type Slice = {
    start?: number;
    stop?: number;
    step?: number;
};
export declare function slice(ind: number | Slice, length: number): [number, number, number];
export declare type Patch<T> = [number, T] | [[number, number | Slice] | [number, number | Slice, number | Slice], T[]] | [Slice, T[]];
export declare type PatchSet<T> = {
    [key: string]: Patch<T>[];
};
export declare function patch_to_column<T>(col: NDArray | NDArray[], patch: Patch<T>[]): Set<number>;
export declare namespace ColumnDataSource {
    type Attrs = p.AttrsOf<Props>;
    type Props = ColumnarDataSource.Props & {
        data: p.Property<{
            [key: string]: Arrayable;
        }>;
    };
}
export interface ColumnDataSource extends ColumnDataSource.Attrs {
}
export declare class ColumnDataSource extends ColumnarDataSource {
    properties: ColumnDataSource.Props;
    constructor(attrs?: Partial<ColumnDataSource.Attrs>);
    static init_ColumnDataSource(): void;
    stream(new_data: Data, rollover?: number, setter_id?: string): void;
    patch(patches: PatchSet<unknown>, setter_id?: string): void;
}
