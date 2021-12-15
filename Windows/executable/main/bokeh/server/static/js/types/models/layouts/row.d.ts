import { Box, BoxView } from "./box";
import { ColsSizing } from "../../core/layout/grid";
import * as p from "../../core/properties";
export declare class RowView extends BoxView {
    model: Row;
    _update_layout(): void;
}
export declare namespace Row {
    type Attrs = p.AttrsOf<Props>;
    type Props = Box.Props & {
        cols: p.Property<ColsSizing>;
    };
}
export interface Row extends Row.Attrs {
}
export declare class Row extends Box {
    properties: Row.Props;
    __view_type__: RowView;
    constructor(attrs?: Partial<Row.Attrs>);
    static init_Row(): void;
}
