import { ActionTool, ActionToolView } from "./action_tool";
import { scale_range } from "../../../core/util/zoom";
import * as p from "../../../core/properties";
export class ZoomBaseToolView extends ActionToolView {
    doit() {
        const frame = this.plot_view.frame;
        const dims = this.model.dimensions;
        // restrict to axis configured in tool's dimensions property
        const h_axis = dims == 'width' || dims == 'both';
        const v_axis = dims == 'height' || dims == 'both';
        const zoom_info = scale_range(frame, this.model.sign * this.model.factor, h_axis, v_axis);
        this.plot_view.push_state('zoom_out', { range: zoom_info });
        this.plot_view.update_range(zoom_info, false, true);
        if (this.model.document)
            this.model.document.interactive_start(this.plot_model);
    }
}
ZoomBaseToolView.__name__ = "ZoomBaseToolView";
export class ZoomBaseTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
    }
    static init_ZoomBaseTool() {
        this.prototype.default_view = ZoomBaseToolView;
        this.define({
            factor: [p.Percent, 0.1],
            dimensions: [p.Dimensions, "both"],
        });
    }
    get tooltip() {
        return this._get_dim_tooltip(this.tool_name, this.dimensions);
    }
}
ZoomBaseTool.__name__ = "ZoomBaseTool";
ZoomBaseTool.init_ZoomBaseTool();
//# sourceMappingURL=zoom_base_tool.js.map