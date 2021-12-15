import { HTMLBox, HTMLBoxView } from "../layouts/html_box";
import * as p from "../../core/properties";
export class WidgetView extends HTMLBoxView {
    _width_policy() {
        return this.model.orientation == "horizontal" ? super._width_policy() : "fixed";
    }
    _height_policy() {
        return this.model.orientation == "horizontal" ? "fixed" : super._height_policy();
    }
    box_sizing() {
        const sizing = super.box_sizing();
        if (this.model.orientation == "horizontal") {
            if (sizing.width == null)
                sizing.width = this.model.default_size;
        }
        else {
            if (sizing.height == null)
                sizing.height = this.model.default_size;
        }
        return sizing;
    }
}
WidgetView.__name__ = "WidgetView";
export class Widget extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
    static init_Widget() {
        this.define({
            orientation: [p.Orientation, "horizontal"],
            default_size: [p.Number, 300],
        });
        this.override({
            margin: [5, 5, 5, 5],
        });
    }
}
Widget.__name__ = "Widget";
Widget.init_Widget();
//# sourceMappingURL=widget.js.map