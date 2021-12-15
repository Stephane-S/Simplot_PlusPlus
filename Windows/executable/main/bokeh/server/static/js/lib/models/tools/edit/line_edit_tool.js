import { LineTool, LineToolView } from "./line_tool";
import * as p from "../../../core/properties";
import { bk_tool_icon_line_edit } from "../../../styles/icons";
export class LineEditToolView extends LineToolView {
    constructor() {
        super(...arguments);
        this._drawing = false;
    }
    _doubletap(ev) {
        if (!this.model.active)
            return;
        const renderers = this.model.renderers;
        for (const renderer of renderers) {
            const line_selected = this._select_event(ev, "replace", [renderer]);
            if (line_selected.length == 1) {
                this._selected_renderer = renderer;
            }
        }
        this._show_intersections();
        this._update_line_cds();
    }
    _show_intersections() {
        if (!this.model.active)
            return;
        if (this._selected_renderer == null)
            return;
        const renderers = this.model.renderers;
        if (!renderers.length) {
            this._set_intersection([], []);
            this._selected_renderer = null;
            this._drawing = false;
            return;
        }
        const cds = this._selected_renderer.data_source;
        const glyph = this._selected_renderer.glyph;
        const [xkey, ykey] = [glyph.x.field, glyph.y.field];
        const x = cds.get_array(xkey);
        const y = cds.get_array(ykey);
        this._set_intersection(x, y);
    }
    _tap(ev) {
        const renderer = this.model.intersection_renderer;
        const point = this._map_drag(ev.sx, ev.sy, renderer);
        if (point == null)
            return;
        else if (this._drawing && this._selected_renderer) {
            const mode = this._select_mode(ev);
            const selected_points = this._select_event(ev, mode, [renderer]);
            if (selected_points.length == 0) {
                return;
            }
        }
        const mode = this._select_mode(ev);
        this._select_event(ev, mode, [renderer]);
        this._select_event(ev, mode, this.model.renderers);
    }
    _update_line_cds() {
        if (this._selected_renderer == null)
            return;
        const point_glyph = this.model.intersection_renderer.glyph;
        const point_cds = this.model.intersection_renderer.data_source;
        const [pxkey, pykey] = [point_glyph.x.field, point_glyph.y.field];
        if (pxkey && pykey) {
            const x = point_cds.data[pxkey];
            const y = point_cds.data[pykey];
            this._selected_renderer.data_source.data[pxkey] = x;
            this._selected_renderer.data_source.data[pykey] = y;
        }
        this._emit_cds_changes(this._selected_renderer.data_source, true, true, false);
    }
    _pan_start(ev) {
        this._select_event(ev, "append", [this.model.intersection_renderer]);
        this._basepoint = [ev.sx, ev.sy];
    }
    _pan(ev) {
        if (this._basepoint == null)
            return;
        this._drag_points(ev, [this.model.intersection_renderer], this.model.dimensions);
        if (this._selected_renderer)
            this._selected_renderer.data_source.change.emit();
    }
    _pan_end(ev) {
        if (this._basepoint == null)
            return;
        this._drag_points(ev, [this.model.intersection_renderer]);
        this._emit_cds_changes(this.model.intersection_renderer.data_source, false, true, true);
        if (this._selected_renderer) {
            this._emit_cds_changes(this._selected_renderer.data_source);
        }
        this._basepoint = null;
    }
    activate() {
        this._drawing = true;
    }
    deactivate() {
        if (!this._selected_renderer) {
            return;
        }
        else if (this._drawing) {
            this._drawing = false;
        }
        this._hide_intersections();
    }
}
LineEditToolView.__name__ = "LineEditToolView";
export class LineEditTool extends LineTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Line Edit Tool";
        this.icon = bk_tool_icon_line_edit;
        this.event_type = ["tap", "pan", "move"];
        this.default_order = 4;
    }
    static init_LineEditTool() {
        this.prototype.default_view = LineEditToolView;
        this.define({
            dimensions: [p.Dimensions, "both"],
        });
    }
    get tooltip() {
        return this._get_dim_tooltip(this.tool_name, this.dimensions);
    }
}
LineEditTool.__name__ = "LineEditTool";
LineEditTool.init_LineEditTool();
//# sourceMappingURL=line_edit_tool.js.map