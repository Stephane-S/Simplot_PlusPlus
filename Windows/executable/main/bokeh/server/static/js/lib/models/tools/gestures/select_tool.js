import { GestureTool, GestureToolView } from "./gesture_tool";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { GraphRenderer } from "../../renderers/graph_renderer";
import { compute_renderers } from "../util";
import * as p from "../../../core/properties";
import { Keys } from "../../../core/dom";
import { SelectionGeometry } from "../../../core/bokeh_events";
import { Signal0 } from "../../../core/signaling";
import { unreachable } from "../../../core/util/assert";
export class SelectToolView extends GestureToolView {
    connect_signals() {
        super.connect_signals();
        this.model.clear.connect(() => this._clear());
    }
    get computed_renderers() {
        const renderers = this.model.renderers;
        const all_renderers = this.plot_model.renderers;
        const names = this.model.names;
        return compute_renderers(renderers, all_renderers, names);
    }
    _computed_renderers_by_data_source() {
        var _a;
        const renderers_by_source = new Map();
        for (const r of this.computed_renderers) {
            let source;
            if (r instanceof GlyphRenderer)
                source = r.data_source;
            else if (r instanceof GraphRenderer)
                source = r.node_renderer.data_source;
            else
                continue;
            const renderers = (_a = renderers_by_source.get(source)) !== null && _a !== void 0 ? _a : [];
            renderers_by_source.set(source, [...renderers, r]);
        }
        return renderers_by_source;
    }
    _select_mode(ev) {
        const { shiftKey, ctrlKey } = ev;
        if (!shiftKey && !ctrlKey)
            return this.model.mode;
        else if (shiftKey && !ctrlKey)
            return "append";
        else if (!shiftKey && ctrlKey)
            return "intersect";
        else if (shiftKey && ctrlKey)
            return "subtract";
        else
            unreachable();
    }
    _keyup(ev) {
        if (ev.keyCode == Keys.Esc) {
            this._clear();
        }
    }
    _clear() {
        for (const renderer of this.computed_renderers) {
            renderer.get_selection_manager().clear();
        }
        this.plot_view.request_render();
    }
    _select(geometry, final, mode) {
        const renderers_by_source = this._computed_renderers_by_data_source();
        for (const [, renderers] of renderers_by_source) {
            const sm = renderers[0].get_selection_manager();
            const r_views = [];
            for (const r of renderers) {
                const r_view = this.plot_view.renderer_views.get(r);
                if (r_view != null) {
                    r_views.push(r_view);
                }
            }
            sm.select(r_views, geometry, final, mode);
        }
        // XXX: messed up class structure
        if (this.model.callback != null)
            this._emit_callback(geometry);
        this._emit_selection_event(geometry, final);
    }
    _emit_selection_event(geometry, final = true) {
        const { x_scale, y_scale } = this.plot_view.frame;
        let geometry_data;
        switch (geometry.type) {
            case "point": {
                const { sx, sy } = geometry;
                const x = x_scale.invert(sx);
                const y = y_scale.invert(sy);
                geometry_data = Object.assign(Object.assign({}, geometry), { x, y });
                break;
            }
            case "span": {
                const { sx, sy } = geometry;
                const x = x_scale.invert(sx);
                const y = y_scale.invert(sy);
                geometry_data = Object.assign(Object.assign({}, geometry), { x, y });
                break;
            }
            case "rect": {
                const { sx0, sx1, sy0, sy1 } = geometry;
                const [x0, x1] = x_scale.r_invert(sx0, sx1);
                const [y0, y1] = y_scale.r_invert(sy0, sy1);
                geometry_data = Object.assign(Object.assign({}, geometry), { x0, y0, x1, y1 });
                break;
            }
            case "poly": {
                const { sx, sy } = geometry;
                const x = x_scale.v_invert(sx);
                const y = y_scale.v_invert(sy);
                geometry_data = Object.assign(Object.assign({}, geometry), { x, y });
                break;
            }
        }
        this.plot_model.trigger_event(new SelectionGeometry(geometry_data, final));
    }
}
SelectToolView.__name__ = "SelectToolView";
export class SelectTool extends GestureTool {
    constructor(attrs) {
        super(attrs);
    }
    initialize() {
        super.initialize();
        this.clear = new Signal0(this, "clear");
    }
    static init_SelectTool() {
        this.define({
            renderers: [p.Any, 'auto'],
            names: [p.Array, []],
            mode: [p.Any, "replace"],
        });
    }
    get menu() {
        return [
            {
                icon: "bk-tool-icon-replace-mode",
                tooltip: "Replace the current selection",
                active: () => this.mode == "replace",
                handler: () => {
                    this.mode = "replace";
                    this.active = true;
                },
            }, {
                icon: "bk-tool-icon-append-mode",
                tooltip: "Append to the current selection (Shift)",
                active: () => this.mode == "append",
                handler: () => {
                    this.mode = "append";
                    this.active = true;
                },
            }, {
                icon: "bk-tool-icon-intersect-mode",
                tooltip: "Intersect with the current selection (Ctrl)",
                active: () => this.mode == "intersect",
                handler: () => {
                    this.mode = "intersect";
                    this.active = true;
                },
            }, {
                icon: "bk-tool-icon-subtract-mode",
                tooltip: "Subtract from the current selection (Shift+Ctrl)",
                active: () => this.mode == "subtract",
                handler: () => {
                    this.mode = "subtract";
                    this.active = true;
                },
            },
            null,
            {
                icon: "bk-tool-icon-clear-selection",
                tooltip: "Clear the current selection (Esc)",
                handler: () => {
                    this.clear.emit();
                },
            },
        ];
    }
}
SelectTool.__name__ = "SelectTool";
SelectTool.init_SelectTool();
//# sourceMappingURL=select_tool.js.map