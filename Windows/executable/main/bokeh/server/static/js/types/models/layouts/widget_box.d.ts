import { Column, ColumnView } from "./column";
import * as p from "../../core/properties";
export declare class WidgetBoxView extends ColumnView {
    model: WidgetBox;
}
export declare namespace WidgetBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = Column.Props;
}
export interface WidgetBox extends Column.Attrs {
}
export declare class WidgetBox extends Column {
    properties: WidgetBox.Props;
    __view_type__: WidgetBoxView;
    constructor(attrs?: Partial<WidgetBox.Attrs>);
    static init_WidgetBox(): void;
}
