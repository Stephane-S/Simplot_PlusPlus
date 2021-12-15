import { Box, BoxView } from "./box";
import { Column as ColumnLayout } from "../../core/layout/grid";
import * as p from "../../core/properties";
export class ColumnView extends BoxView {
    _update_layout() {
        const items = this.child_views.map((child) => child.layout);
        this.layout = new ColumnLayout(items);
        this.layout.rows = this.model.rows;
        this.layout.spacing = [this.model.spacing, 0];
        this.layout.set_sizing(this.box_sizing());
    }
}
ColumnView.__name__ = "ColumnView";
export class Column extends Box {
    constructor(attrs) {
        super(attrs);
    }
    static init_Column() {
        this.prototype.default_view = ColumnView;
        this.define({
            rows: [p.Any, "auto"],
        });
    }
}
Column.__name__ = "Column";
Column.init_Column();
//# sourceMappingURL=column.js.map