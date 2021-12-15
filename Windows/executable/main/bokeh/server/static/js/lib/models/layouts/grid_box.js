import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { Grid } from "../../core/layout/grid";
import * as p from "../../core/properties";
export class GridBoxView extends LayoutDOMView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.children.change, () => this.rebuild());
    }
    get child_models() {
        return this.model.children.map(([child]) => child);
    }
    _update_layout() {
        this.layout = new Grid();
        this.layout.rows = this.model.rows;
        this.layout.cols = this.model.cols;
        this.layout.spacing = this.model.spacing;
        for (const [child, row, col, row_span, col_span] of this.model.children) {
            const child_view = this._child_views.get(child);
            this.layout.items.push({ layout: child_view.layout, row, col, row_span, col_span });
        }
        this.layout.set_sizing(this.box_sizing());
    }
}
GridBoxView.__name__ = "GridBoxView";
export class GridBox extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
    static init_GridBox() {
        this.prototype.default_view = GridBoxView;
        this.define({
            children: [p.Array, []],
            rows: [p.Any, "auto"],
            cols: [p.Any, "auto"],
            spacing: [p.Any, 0],
        });
    }
}
GridBox.__name__ = "GridBox";
GridBox.init_GridBox();
//# sourceMappingURL=grid_box.js.map