import { DataSource } from "./data_source";
import { Signal, Signal0 } from "../../core/signaling";
import { SelectionManager } from "../../core/selection_manager";
import * as p from "../../core/properties";
import { Arrayable } from "../../core/types";
import { Selection } from "../selections/selection";
import { SelectionPolicy } from "../selections/interaction_policy";
export declare namespace ColumnarDataSource {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataSource.Props & {
        data: p.Property<{
            [key: string]: Arrayable;
        }>;
        selection_policy: p.Property<SelectionPolicy>;
        selection_manager: p.Property<SelectionManager>;
        inspected: p.Property<Selection>;
    };
}
export interface ColumnarDataSource extends ColumnarDataSource.Attrs {
}
export declare abstract class ColumnarDataSource extends DataSource {
    properties: ColumnarDataSource.Props;
    data: {
        [key: string]: Arrayable;
    };
    get_array<T>(key: string): T[];
    _select: Signal0<this>;
    inspect: Signal<unknown, this>;
    streaming: Signal0<this>;
    patching: Signal<number[], this>;
    constructor(attrs?: Partial<ColumnarDataSource.Attrs>);
    static init_ColumnarDataSource(): void;
    initialize(): void;
    get_column(colname: string): Arrayable | null;
    columns(): string[];
    get_length(soft?: boolean): number | null;
    get length(): number;
    clear(): void;
}
