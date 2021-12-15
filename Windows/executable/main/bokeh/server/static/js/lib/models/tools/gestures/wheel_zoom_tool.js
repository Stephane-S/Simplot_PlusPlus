import { GestureTool, GestureToolView } from "./gesture_tool";
import { scale_range } from "../../../core/util/zoom";
import * as p from "../../../core/properties";
import { is_mobile } from "../../../core/util/compat";
import { bk_tool_icon_wheel_zoom } from "../../../styles/icons";
export class WheelZoomToolView extends GestureToolView {
    _pinch(ev) {
        // TODO (bev) this can probably be done much better
        const { sx, sy, scale, ctrlKey, shiftKey } = ev;
        let delta;
        if (scale >= 1)
            delta = (scale - 1) * 20.0;
        else
            delta = -20.0 / scale;
        this._scroll({ type: "wheel", sx, sy, delta, ctrlKey, shiftKey });
    }
    _scroll(ev) {
        const { frame } = this.plot_view;
        const hr = frame.bbox.h_range;
        const vr = frame.bbox.v_range;
        const { sx, sy } = ev;
        const dims = this.model.dimensions;
        // restrict to axis configured in tool's dimensions property and if
        // zoom origin is inside of frame range/domain
        const h_axis = (dims == 'width' || dims == 'both') && hr.start < sx && sx < hr.end;
        const v_axis = (dims == 'height' || dims == 'both') && vr.start < sy && sy < vr.end;
        if ((!h_axis || !v_axis) && !this.model.zoom_on_axis) {
            return;
        }
        const factor = this.model.speed * ev.delta;
        const zoom_info = scale_range(frame, factor, h_axis, v_axis, { x: sx, y: sy });
        this.plot_view.push_state('wheel_zoom', { range: zoom_info });
        this.plot_view.update_range(zoom_info, false, true, this.model.maintain_focus);
        if (this.model.document != null)
            this.model.document.interactive_start(this.plot_model);
    }
}
WheelZoomToolView.__name__ = "WheelZoomToolView";
export class WheelZoomTool extends GestureTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Wheel Zoom";
        this.icon = bk_tool_icon_wheel_zoom;
        this.event_type = is_mobile ? "pinch" : "scroll";
        this.default_order = 10;
    }
    static init_WheelZoomTool() {
        this.prototype.default_view = WheelZoomToolView;
        this.define({
            dimensions: [p.Dimensions, "both"],
            maintain_focus: [p.Boolean, true],
            zoom_on_axis: [p.Boolean, true],
            speed: [p.Number, 1 / 600],
        });
        this.register_alias("wheel_zoom", () => new WheelZoomTool({ dimensions: 'both' }));
        this.register_alias("xwheel_zoom", () => new WheelZoomTool({ dimensions: 'width' }));
        this.register_alias("ywheel_zoom", () => new WheelZoomTool({ dimensions: 'height' }));
    }
    get tooltip() {
        return this._get_dim_tooltip(this.tool_name, this.dimensions);
    }
}
WheelZoomTool.__name__ = "WheelZoomTool";
WheelZoomTool.init_WheelZoomTool();
//# sourceMappingURL=wheel_zoom_tool.js.map