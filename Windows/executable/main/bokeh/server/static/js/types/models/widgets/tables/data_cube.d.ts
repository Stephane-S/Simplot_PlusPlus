/// <reference types="slickgrid" />
import * as p from "../../../core/properties";
import { Column, RowMetadata } from '@bokeh/slickgrid';
import { TableDataProvider, DataTableView, DataTable } from './data_table';
import { Item } from "./table_column";
import { ColumnDataSource } from '../../sources/column_data_source';
import { CDSView } from '../../sources/cds_view';
import { RowAggregator } from './row_aggregators';
import { Model } from "../../../model";
export declare namespace GroupingInfo {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        getter: p.Property<string>;
        aggregators: p.Property<RowAggregator[]>;
        collapsed: p.Property<boolean>;
    };
}
export interface GroupingInfo extends GroupingInfo.Attrs {
}
export declare class GroupingInfo extends Model {
    properties: GroupingInfo.Props;
    constructor(attrs?: Partial<GroupingInfo.Attrs>);
    static init_GroupingInfo(): void;
    get comparer(): (a: {
        value: any;
    }, b: {
        value: any;
    }) => number;
}
export declare class DataCubeProvider extends TableDataProvider {
    readonly columns: Column<Item>[];
    groupingInfos: GroupingInfo[];
    readonly groupingDelimiter: string;
    toggledGroupsByLevel: {
        [key: string]: boolean;
    }[];
    private rows;
    target: ColumnDataSource;
    constructor(source: ColumnDataSource, view: CDSView, columns: Column<Item>[], target: ColumnDataSource);
    setGrouping(groupingInfos: GroupingInfo[]): void;
    private extractGroups;
    private calculateTotals;
    private addTotals;
    private flattenedGroupedRows;
    refresh(): void;
    getLength(): number;
    getItem(i: number): Item;
    getItemMetadata(i: number): RowMetadata<Item>;
    collapseGroup(groupingKey: string): void;
    expandGroup(groupingKey: string): void;
}
export declare class DataCubeView extends DataTableView {
    model: DataCube;
    protected data: DataCubeProvider;
    render(): void;
}
export declare namespace DataCube {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataTable.Props & {
        grouping: p.Property<GroupingInfo[]>;
        target: p.Property<ColumnDataSource>;
    };
}
export interface DataCube extends DataCube.Attrs {
}
export declare class DataCube extends DataTable {
    properties: DataCube.Props;
    constructor(attrs?: Partial<DataCube.Attrs>);
    static init_DataCube(): void;
}
