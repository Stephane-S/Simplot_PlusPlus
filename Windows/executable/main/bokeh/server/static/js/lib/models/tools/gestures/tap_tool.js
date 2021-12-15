import { SelectTool, SelectToolView } from "./select_tool";
import * as p from "../../../core/properties";
import { bk_tool_icon_tap_select } from "../../../styles/icons";
export class TapToolView extends SelectToolView {
    _tap(ev) {
        const { sx, sy } = ev;
        const geometry = { type: "point", sx, sy };
        this._select(geometry, true, this._select_mode(ev));
    }
    _select(geometry, final, mode) {
        const callback = this.model.callback;
        if (this.model.behavior == "select") {
            const renderers_by_source = this._computed_renderers_by_data_source();
            for (const [, renderers] of renderers_by_source) {
                const sm = renderers[0].get_selection_manager();
                const r_views = renderers.map((r) => this.plot_view.renderer_views.get(r));
                const did_hit = sm.select(r_views, geometry, final, mode);
                if (did_hit && callback != null) {
                    const x = r_views[0].coordinates.x_scale.invert(geometry.sx);
                    const y = r_views[0].coordinates.y_scale.invert(geometry.sy);
                    const data = { geometries: Object.assign(Object.assign({}, geometry), { x, y }), source: sm.source };
                    callback.execute(this.model, data);
                }
            }
            this._emit_selection_event(geometry);
            this.plot_view.push_state('tap', { selection: this.plot_view.get_selection() });
        }
        else {
            for (const r of this.computed_renderers) {
                const rv = this.plot_view.renderer_views.get(r);
                const sm = r.get_selection_manager();
                const did_hit = sm.inspect(rv, geometry);
                if (did_hit && callback != null) {
                    const x = rv.coordinates.x_scale.invert(geometry.sx);
                    const y = rv.coordinates.y_scale.invert(geometry.sy);
                    const data = { geometries: Object.assign(Object.assign({}, geometry), { x, y }), source: sm.source };
                    callback.execute(this.model, data);
                }
            }
        }
    }
}
TapToolView.__name__ = "TapToolView";
export class TapTool extends SelectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Tap";
        this.icon = bk_tool_icon_tap_select;
        this.event_type = "tap";
        this.default_order = 10;
    }
    static init_TapTool() {
        this.prototype.default_view = TapToolView;
        this.define({
            behavior: [p.TapBehavior, "select"],
            callback: [p.Any],
        });
        this.register_alias("click", () => new TapTool({ behavior: "inspect" }));
        this.register_alias("tap", () => new TapTool());
    }
}
TapTool.__name__ = "TapTool";
TapTool.init_TapTool();
//# sourceMappingURL=tap_tool.js.map