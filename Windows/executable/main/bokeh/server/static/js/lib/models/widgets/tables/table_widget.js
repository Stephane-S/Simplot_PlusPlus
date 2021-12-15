import { Widget } from "../widget";
import { CDSView } from "../../sources/cds_view";
import * as p from "../../../core/properties";
export class TableWidget extends Widget {
    constructor(attrs) {
        super(attrs);
    }
    static init_TableWidget() {
        this.define({
            source: [p.Instance],
            view: [p.Instance, () => new CDSView()],
        });
    }
    initialize() {
        super.initialize();
        if (this.view.source == null) {
            this.view.source = this.source;
            this.view.compute_indices();
        }
    }
}
TableWidget.__name__ = "TableWidget";
TableWidget.init_TableWidget();
//# sourceMappingURL=table_widget.js.map