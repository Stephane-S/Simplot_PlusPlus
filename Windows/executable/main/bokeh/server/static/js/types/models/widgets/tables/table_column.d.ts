/// <reference types="slickgrid" />
import { CellFormatter } from "./cell_formatters";
import { CellEditor } from "./cell_editors";
import * as p from "../../../core/properties";
import { Column } from "@bokeh/slickgrid";
import { Sort } from "../../../core/enums";
import { Model } from "../../../model";
export declare type Item = {
    [key: string]: any;
};
export declare type ColumnType = Column<Item> & {
    model?: CellEditor;
};
export declare namespace TableColumn {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        field: p.Property<string>;
        title: p.Property<string>;
        width: p.Property<number>;
        formatter: p.Property<CellFormatter>;
        editor: p.Property<CellEditor>;
        sortable: p.Property<boolean>;
        default_sort: p.Property<Sort>;
    };
}
export interface TableColumn extends TableColumn.Attrs {
}
export declare class TableColumn extends Model {
    properties: TableColumn.Props;
    constructor(attrs?: Partial<TableColumn.Attrs>);
    static init_TableColumn(): void;
    toColumn(): ColumnType;
}
