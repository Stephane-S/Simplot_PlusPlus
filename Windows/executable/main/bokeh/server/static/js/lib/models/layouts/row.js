import { Box, BoxView } from "./box";
import { Row as RowLayout } from "../../core/layout/grid";
import * as p from "../../core/properties";
export class RowView extends BoxView {
    _update_layout() {
        const items = this.child_views.map((child) => child.layout);
        this.layout = new RowLayout(items);
        this.layout.cols = this.model.cols;
        this.layout.spacing = [0, this.model.spacing];
        this.layout.set_sizing(this.box_sizing());
    }
}
RowView.__name__ = "RowView";
export class Row extends Box {
    constructor(attrs) {
        super(attrs);
    }
    static init_Row() {
        this.prototype.default_view = RowView;
        this.define({
            cols: [p.Any, "auto"],
        });
    }
}
Row.__name__ = "Row";
Row.init_Row();
//# sourceMappingURL=row.js.map