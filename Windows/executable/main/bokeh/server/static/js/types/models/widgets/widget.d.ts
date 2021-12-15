import { HTMLBox, HTMLBoxView } from "../layouts/html_box";
import { Orientation } from "../../core/enums";
import { BoxSizing, SizingPolicy } from "../../core/layout";
import * as p from "../../core/properties";
export declare abstract class WidgetView extends HTMLBoxView {
    model: Widget;
    protected _width_policy(): SizingPolicy;
    protected _height_policy(): SizingPolicy;
    box_sizing(): Partial<BoxSizing>;
}
export declare namespace Widget {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        orientation: p.Property<Orientation>;
        default_size: p.Property<number>;
    };
}
export interface Widget extends Widget.Attrs {
}
export declare abstract class Widget extends HTMLBox {
    properties: Widget.Props;
    __view_type__: WidgetView;
    constructor(attrs?: Partial<Widget.Attrs>);
    static init_Widget(): void;
}
