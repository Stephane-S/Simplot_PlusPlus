import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
import { ContentBox } from "../../core/layout";
export class HTMLBoxView extends LayoutDOMView {
    get child_models() {
        return [];
    }
    _update_layout() {
        this.layout = new ContentBox(this.el);
        this.layout.set_sizing(this.box_sizing());
    }
}
HTMLBoxView.__name__ = "HTMLBoxView";
export class HTMLBox extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
HTMLBox.__name__ = "HTMLBox";
//# sourceMappingURL=html_box.js.map