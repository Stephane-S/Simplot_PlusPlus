import { InspectTool, InspectToolView } from "./inspect_tool";
import { Span } from "../../annotations/span";
import * as p from "../../../core/properties";
import { values } from "../../../core/util/object";
import { bk_tool_icon_crosshair } from "../../../styles/icons";
export class CrosshairToolView extends InspectToolView {
    _move(ev) {
        if (!this.model.active)
            return;
        const { sx, sy } = ev;
        if (!this.plot_view.frame.bbox.contains(sx, sy))
            this._update_spans(null, null);
        else
            this._update_spans(sx, sy);
    }
    _move_exit(_e) {
        this._update_spans(null, null);
    }
    _update_spans(x, y) {
        const dims = this.model.dimensions;
        if (dims == "width" || dims == "both")
            this.model.spans.width.location = y;
        if (dims == "height" || dims == "both")
            this.model.spans.height.location = x;
    }
}
CrosshairToolView.__name__ = "CrosshairToolView";
export class CrosshairTool extends InspectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Crosshair";
        this.icon = bk_tool_icon_crosshair;
    }
    static init_CrosshairTool() {
        this.prototype.default_view = CrosshairToolView;
        this.define({
            dimensions: [p.Dimensions, "both"],
            line_color: [p.Color, 'black'],
            line_width: [p.Number, 1],
            line_alpha: [p.Number, 1.0],
        });
        this.internal({
            spans: [p.Any],
        });
        this.register_alias("crosshair", () => new CrosshairTool());
    }
    get tooltip() {
        return this._get_dim_tooltip("Crosshair", this.dimensions);
    }
    get synthetic_renderers() {
        return values(this.spans);
    }
    initialize() {
        super.initialize();
        this.spans = {
            width: new Span({
                for_hover: true,
                dimension: "width",
                location_units: "screen",
                level: "overlay",
                line_color: this.line_color,
                line_width: this.line_width,
                line_alpha: this.line_alpha,
            }),
            height: new Span({
                for_hover: true,
                dimension: "height",
                location_units: "screen",
                level: "overlay",
                line_color: this.line_color,
                line_width: this.line_width,
                line_alpha: this.line_alpha,
            }),
        };
    }
}
CrosshairTool.__name__ = "CrosshairTool";
CrosshairTool.init_CrosshairTool();
//# sourceMappingURL=crosshair_tool.js.map