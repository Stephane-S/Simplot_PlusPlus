import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import * as p from "../../core/properties";
export class BoxView extends LayoutDOMView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.children.change, () => this.rebuild());
    }
    get child_models() {
        return this.model.children;
    }
}
BoxView.__name__ = "BoxView";
export class Box extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
    static init_Box() {
        this.define({
            children: [p.Array, []],
            spacing: [p.Number, 0],
        });
    }
}
Box.__name__ = "Box";
Box.init_Box();
//# sourceMappingURL=box.js.map