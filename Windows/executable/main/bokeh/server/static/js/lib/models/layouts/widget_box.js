import { Column, ColumnView } from "./column";
export class WidgetBoxView extends ColumnView {
}
WidgetBoxView.__name__ = "WidgetBoxView";
export class WidgetBox extends Column {
    constructor(attrs) {
        super(attrs);
    }
    static init_WidgetBox() {
        this.prototype.default_view = WidgetBoxView;
    }
}
WidgetBox.__name__ = "WidgetBox";
WidgetBox.init_WidgetBox();
//# sourceMappingURL=widget_box.js.map