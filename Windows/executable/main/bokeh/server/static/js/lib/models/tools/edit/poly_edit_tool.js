import { Keys } from "../../../core/dom";
import { isArray } from "../../../core/util/types";
import { PolyTool, PolyToolView } from "./poly_tool";
import { bk_tool_icon_poly_edit } from "../../../styles/icons";
export class PolyEditToolView extends PolyToolView {
    constructor() {
        super(...arguments);
        this._drawing = false;
    }
    _doubletap(ev) {
        if (!this.model.active)
            return;
        const point = this._map_drag(ev.sx, ev.sy, this.model.vertex_renderer);
        if (point == null)
            return;
        const [x, y] = point;
        // Perform hit testing
        const vertex_selected = this._select_event(ev, "replace", [this.model.vertex_renderer]);
        const point_cds = this.model.vertex_renderer.data_source;
        // Type once dataspecs are typed
        const point_glyph = this.model.vertex_renderer.glyph;
        const [pxkey, pykey] = [point_glyph.x.field, point_glyph.y.field];
        if (vertex_selected.length && this._selected_renderer != null) {
            // Insert a new point after the selected vertex and enter draw mode
            const index = point_cds.selected.indices[0];
            if (this._drawing) {
                this._drawing = false;
                point_cds.selection_manager.clear();
            }
            else {
                point_cds.selected.indices = [index + 1];
                if (pxkey)
                    point_cds.get_array(pxkey).splice(index + 1, 0, x);
                if (pykey)
                    point_cds.get_array(pykey).splice(index + 1, 0, y);
                this._drawing = true;
            }
            point_cds.change.emit();
            this._emit_cds_changes(this._selected_renderer.data_source);
        }
        else {
            this._show_vertices(ev);
        }
    }
    _show_vertices(ev) {
        if (!this.model.active)
            return;
        const renderers = this._select_event(ev, "replace", this.model.renderers);
        if (!renderers.length) {
            this._set_vertices([], []);
            this._selected_renderer = null;
            this._drawing = false;
            return;
        }
        const renderer = renderers[0];
        const glyph = renderer.glyph;
        const cds = renderer.data_source;
        const index = cds.selected.indices[0];
        const [xkey, ykey] = [glyph.xs.field, glyph.ys.field];
        let xs;
        let ys;
        if (xkey) {
            xs = cds.data[xkey][index];
            if (!isArray(xs))
                cds.data[xkey][index] = xs = Array.from(xs);
        }
        else {
            xs = glyph.xs.value;
        }
        if (ykey) {
            ys = cds.data[ykey][index];
            if (!isArray(ys))
                cds.data[ykey][index] = ys = Array.from(ys);
        }
        else {
            ys = glyph.ys.value;
        }
        this._selected_renderer = renderer;
        this._set_vertices(xs, ys);
    }
    _move(ev) {
        if (this._drawing && this._selected_renderer != null) {
            const renderer = this.model.vertex_renderer;
            const cds = renderer.data_source;
            const glyph = renderer.glyph;
            const point = this._map_drag(ev.sx, ev.sy, renderer);
            if (point == null)
                return;
            let [x, y] = point;
            const indices = cds.selected.indices;
            [x, y] = this._snap_to_vertex(ev, x, y);
            cds.selected.indices = indices;
            const [xkey, ykey] = [glyph.x.field, glyph.y.field];
            const index = indices[0];
            if (xkey)
                cds.data[xkey][index] = x;
            if (ykey)
                cds.data[ykey][index] = y;
            cds.change.emit();
            this._selected_renderer.data_source.change.emit();
        }
    }
    _tap(ev) {
        const renderer = this.model.vertex_renderer;
        const point = this._map_drag(ev.sx, ev.sy, renderer);
        if (point == null)
            return;
        else if (this._drawing && this._selected_renderer) {
            let [x, y] = point;
            const cds = renderer.data_source;
            // Type once dataspecs are typed
            const glyph = renderer.glyph;
            const [xkey, ykey] = [glyph.x.field, glyph.y.field];
            const indices = cds.selected.indices;
            [x, y] = this._snap_to_vertex(ev, x, y);
            const index = indices[0];
            cds.selected.indices = [index + 1];
            if (xkey) {
                const xs = cds.get_array(xkey);
                const nx = xs[index];
                xs[index] = x;
                xs.splice(index + 1, 0, nx);
            }
            if (ykey) {
                const ys = cds.get_array(ykey);
                const ny = ys[index];
                ys[index] = y;
                ys.splice(index + 1, 0, ny);
            }
            cds.change.emit();
            this._emit_cds_changes(this._selected_renderer.data_source, true, false, true);
            return;
        }
        const mode = this._select_mode(ev);
        this._select_event(ev, mode, [renderer]);
        this._select_event(ev, mode, this.model.renderers);
    }
    _remove_vertex() {
        if (!this._drawing || !this._selected_renderer)
            return;
        const renderer = this.model.vertex_renderer;
        const cds = renderer.data_source;
        // Type once dataspecs are typed
        const glyph = renderer.glyph;
        const index = cds.selected.indices[0];
        const [xkey, ykey] = [glyph.x.field, glyph.y.field];
        if (xkey)
            cds.get_array(xkey).splice(index, 1);
        if (ykey)
            cds.get_array(ykey).splice(index, 1);
        cds.change.emit();
        this._emit_cds_changes(this._selected_renderer.data_source);
    }
    _pan_start(ev) {
        this._select_event(ev, "append", [this.model.vertex_renderer]);
        this._basepoint = [ev.sx, ev.sy];
    }
    _pan(ev) {
        if (this._basepoint == null)
            return;
        this._drag_points(ev, [this.model.vertex_renderer]);
        if (this._selected_renderer)
            this._selected_renderer.data_source.change.emit();
    }
    _pan_end(ev) {
        if (this._basepoint == null)
            return;
        this._drag_points(ev, [this.model.vertex_renderer]);
        this._emit_cds_changes(this.model.vertex_renderer.data_source, false, true, true);
        if (this._selected_renderer) {
            this._emit_cds_changes(this._selected_renderer.data_source);
        }
        this._basepoint = null;
    }
    _keyup(ev) {
        if (!this.model.active || !this._mouse_in_frame)
            return;
        let renderers;
        if (this._selected_renderer) {
            renderers = [this.model.vertex_renderer];
        }
        else {
            renderers = this.model.renderers;
        }
        for (const renderer of renderers) {
            if (ev.keyCode === Keys.Backspace) {
                this._delete_selected(renderer);
                if (this._selected_renderer) {
                    this._emit_cds_changes(this._selected_renderer.data_source);
                }
            }
            else if (ev.keyCode == Keys.Esc) {
                if (this._drawing) {
                    this._remove_vertex();
                    this._drawing = false;
                }
                else if (this._selected_renderer) {
                    this._hide_vertices();
                }
                renderer.data_source.selection_manager.clear();
            }
        }
    }
    deactivate() {
        if (!this._selected_renderer) {
            return;
        }
        else if (this._drawing) {
            this._remove_vertex();
            this._drawing = false;
        }
        this._hide_vertices();
    }
}
PolyEditToolView.__name__ = "PolyEditToolView";
export class PolyEditTool extends PolyTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Poly Edit Tool";
        this.icon = bk_tool_icon_poly_edit;
        this.event_type = ["tap", "pan", "move"];
        this.default_order = 4;
    }
    static init_PolyEditTool() {
        this.prototype.default_view = PolyEditToolView;
    }
}
PolyEditTool.__name__ = "PolyEditTool";
PolyEditTool.init_PolyEditTool();
//# sourceMappingURL=poly_edit_tool.js.map