import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { Grid, RowsSizing, ColsSizing } from "../../core/layout/grid";
import * as p from "../../core/properties";
export declare class GridBoxView extends LayoutDOMView {
    model: GridBox;
    layout: Grid;
    connect_signals(): void;
    get child_models(): LayoutDOM[];
    _update_layout(): void;
}
export declare namespace GridBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props & {
        children: p.Property<[LayoutDOM, number, number, number?, number?][]>;
        rows: p.Property<RowsSizing>;
        cols: p.Property<ColsSizing>;
        spacing: p.Property<number | [number, number]>;
    };
}
export interface GridBox extends GridBox.Attrs {
}
export declare class GridBox extends LayoutDOM {
    properties: GridBox.Props;
    __view_type__: GridBoxView;
    constructor(attrs?: Partial<GridBox.Attrs>);
    static init_GridBox(): void;
}
