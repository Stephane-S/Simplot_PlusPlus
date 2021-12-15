/// <reference types="slickgrid" />
import { Grid as SlickGrid, DataProvider, SortColumn } from "@bokeh/slickgrid";
import * as p from "../../../core/properties";
import { BoxSizing } from "../../../core/layout";
import { WidgetView } from "../widget";
import { TableWidget } from "./table_widget";
import { TableColumn, ColumnType, Item } from "./table_column";
import { ColumnDataSource } from "../../sources/column_data_source";
import { CDSView } from "../../sources/cds_view";
export declare const DTINDEX_NAME = "__bkdt_internal_index__";
export declare const AutosizeModes: {
    fit_columns: string;
    fit_viewport: string;
    force_fit: string;
    none: string;
};
export declare class TableDataProvider implements DataProvider<Item> {
    index: number[];
    source: ColumnDataSource;
    view: CDSView;
    constructor(source: ColumnDataSource, view: CDSView);
    init(source: ColumnDataSource, view: CDSView): void;
    getLength(): number;
    getItem(offset: number): Item;
    getField(offset: number, field: string): unknown;
    setField(offset: number, field: string, value: unknown): void;
    getRecords(): Item[];
    getItems(): Item[];
    slice(start: number, end: number | null, step?: number): Item[];
    sort(columns: SortColumn<Item>[]): void;
}
export declare class DataTableView extends WidgetView {
    model: DataTable;
    protected data: TableDataProvider;
    protected grid: SlickGrid<Item>;
    protected _in_selection_update: boolean;
    protected _warned_not_reorderable: boolean;
    protected _width: number | null;
    connect_signals(): void;
    remove(): void;
    styles(): string[];
    update_position(): void;
    after_layout(): void;
    box_sizing(): Partial<BoxSizing>;
    updateLayout(initialized: boolean, rerender: boolean): void;
    updateGrid(): void;
    updateSelection(): void;
    newIndexColumn(): ColumnType;
    css_classes(): string[];
    get autosize(): string;
    render(): void;
    _hide_header(): void;
}
export declare namespace DataTable {
    type Attrs = p.AttrsOf<Props>;
    type Props = TableWidget.Props & {
        autosize_mode: p.Property<"fit_columns" | "fit_viewport" | "none" | "force_fit">;
        auto_edit: p.Property<boolean>;
        columns: p.Property<TableColumn[]>;
        fit_columns: p.Property<boolean | null>;
        frozen_columns: p.Property<number | null>;
        frozen_rows: p.Property<number | null>;
        sortable: p.Property<boolean>;
        reorderable: p.Property<boolean>;
        editable: p.Property<boolean>;
        selectable: p.Property<boolean | "checkbox">;
        index_position: p.Property<number | null>;
        index_header: p.Property<string>;
        index_width: p.Property<number>;
        scroll_to_selection: p.Property<boolean>;
        header_row: p.Property<boolean>;
        row_height: p.Property<number>;
    };
}
export interface DataTable extends DataTable.Attrs {
}
export declare class DataTable extends TableWidget {
    properties: DataTable.Props;
    __view_type__: DataTableView;
    private _sort_columns;
    get sort_columns(): {
        field: string;
        sortAsc: boolean;
    }[];
    constructor(attrs?: Partial<DataTable.Attrs>);
    static init_DataTable(): void;
    update_sort_columns(sort_cols: SortColumn<Item>[]): void;
    get_scroll_index(grid_range: {
        top: number;
        bottom: number;
    }, selected_indices: number[]): number | null;
}
