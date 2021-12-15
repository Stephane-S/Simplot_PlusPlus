import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
import * as p from "../../core/properties";
export declare abstract class HTMLBoxView extends LayoutDOMView {
    model: HTMLBox;
    get child_models(): LayoutDOM[];
    _update_layout(): void;
}
export declare namespace HTMLBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props;
}
export interface HTMLBox extends HTMLBox.Attrs {
}
export declare abstract class HTMLBox extends LayoutDOM {
    properties: HTMLBox.Props;
    __view_type__: HTMLBoxView;
    constructor(attrs?: Partial<HTMLBox.Attrs>);
}
