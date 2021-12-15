import { SelectTool, SelectToolView } from "./select_tool";
import { PolyAnnotation } from "../../annotations/poly_annotation";
import { Keys } from "../../../core/dom";
import * as p from "../../../core/properties";
import { copy } from "../../../core/util/array";
import { bk_tool_icon_polygon_select } from "../../../styles/icons";
export class PolySelectToolView extends SelectToolView {
    initialize() {
        super.initialize();
        this.data = { sx: [], sy: [] };
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.active.change, () => this._active_change());
    }
    _active_change() {
        if (!this.model.active)
            this._clear_data();
    }
    _keyup(ev) {
        if (ev.keyCode == Keys.Enter)
            this._clear_data();
    }
    _doubletap(ev) {
        this._do_select(this.data.sx, this.data.sy, true, this._select_mode(ev));
        this.plot_view.push_state('poly_select', { selection: this.plot_view.get_selection() });
        this._clear_data();
    }
    _clear_data() {
        this.data = { sx: [], sy: [] };
        this.model.overlay.update({ xs: [], ys: [] });
    }
    _tap(ev) {
        const { sx, sy } = ev;
        const frame = this.plot_view.frame;
        if (!frame.bbox.contains(sx, sy))
            return;
        this.data.sx.push(sx);
        this.data.sy.push(sy);
        this.model.overlay.update({ xs: copy(this.data.sx), ys: copy(this.data.sy) });
    }
    _do_select(sx, sy, final, mode) {
        const geometry = { type: 'poly', sx, sy };
        this._select(geometry, final, mode);
    }
}
PolySelectToolView.__name__ = "PolySelectToolView";
export const DEFAULT_POLY_OVERLAY = () => {
    return new PolyAnnotation({
        level: "overlay",
        xs_units: "screen",
        ys_units: "screen",
        fill_color: "lightgrey",
        fill_alpha: 0.5,
        line_color: "black",
        line_alpha: 1.0,
        line_width: 2,
        line_dash: [4, 4],
    });
};
export class PolySelectTool extends SelectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Poly Select";
        this.icon = bk_tool_icon_polygon_select;
        this.event_type = "tap";
        this.default_order = 11;
    }
    static init_PolySelectTool() {
        this.prototype.default_view = PolySelectToolView;
        this.define({
            overlay: [p.Instance, DEFAULT_POLY_OVERLAY],
        });
        this.register_alias("poly_select", () => new PolySelectTool());
    }
}
PolySelectTool.__name__ = "PolySelectTool";
PolySelectTool.init_PolySelectTool();
//# sourceMappingURL=poly_select_tool.js.map