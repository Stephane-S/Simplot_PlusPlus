import { Box, BoxView } from "./box";
import { RowsSizing } from "../../core/layout/grid";
import * as p from "../../core/properties";
export declare class ColumnView extends BoxView {
    model: Column;
    _update_layout(): void;
}
export declare namespace Column {
    type Attrs = p.AttrsOf<Props>;
    type Props = Box.Props & {
        rows: p.Property<RowsSizing>;
    };
}
export interface Column extends Column.Attrs {
}
export declare class Column extends Box {
    properties: Column.Props;
    __view_type__: ColumnView;
    constructor(attrs?: Partial<Column.Attrs>);
    static init_Column(): void;
}
