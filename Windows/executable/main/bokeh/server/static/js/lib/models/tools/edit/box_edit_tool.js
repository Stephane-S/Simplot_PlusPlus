import { Keys } from "../../../core/dom";
import * as p from "../../../core/properties";
import { EditTool, EditToolView } from "./edit_tool";
import { bk_tool_icon_box_edit } from "../../../styles/icons";
export class BoxEditToolView extends EditToolView {
    _tap(ev) {
        if ((this._draw_basepoint != null) || (this._basepoint != null))
            return;
        this._select_event(ev, this._select_mode(ev), this.model.renderers);
    }
    _keyup(ev) {
        if (!this.model.active || !this._mouse_in_frame)
            return;
        for (const renderer of this.model.renderers) {
            if (ev.keyCode === Keys.Backspace) {
                this._delete_selected(renderer);
            }
            else if (ev.keyCode == Keys.Esc) {
                // Type properly once selection_manager is typed
                const cds = renderer.data_source;
                cds.selection_manager.clear();
            }
        }
    }
    _set_extent([sx0, sx1], [sy0, sy1], append, emit = false) {
        const renderer = this.model.renderers[0];
        const renderer_view = this.plot_view.renderer_views.get(renderer);
        // Type once dataspecs are typed
        const glyph = renderer.glyph;
        const cds = renderer.data_source;
        const [x0, x1] = renderer_view.coordinates.x_scale.r_invert(sx0, sx1);
        const [y0, y1] = renderer_view.coordinates.y_scale.r_invert(sy0, sy1);
        const [x, y] = [(x0 + x1) / 2, (y0 + y1) / 2];
        const [w, h] = [x1 - x0, y1 - y0];
        const [xkey, ykey] = [glyph.x.field, glyph.y.field];
        const [wkey, hkey] = [glyph.width.field, glyph.height.field];
        if (append) {
            this._pop_glyphs(cds, this.model.num_objects);
            if (xkey)
                cds.get_array(xkey).push(x);
            if (ykey)
                cds.get_array(ykey).push(y);
            if (wkey)
                cds.get_array(wkey).push(w);
            if (hkey)
                cds.get_array(hkey).push(h);
            this._pad_empty_columns(cds, [xkey, ykey, wkey, hkey]);
        }
        else {
            const index = cds.data[xkey].length - 1;
            if (xkey)
                cds.data[xkey][index] = x;
            if (ykey)
                cds.data[ykey][index] = y;
            if (wkey)
                cds.data[wkey][index] = w;
            if (hkey)
                cds.data[hkey][index] = h;
        }
        this._emit_cds_changes(cds, true, false, emit);
    }
    _update_box(ev, append = false, emit = false) {
        if (this._draw_basepoint == null)
            return;
        const curpoint = [ev.sx, ev.sy];
        const frame = this.plot_view.frame;
        const dims = this.model.dimensions;
        const limits = this.model._get_dim_limits(this._draw_basepoint, curpoint, frame, dims);
        if (limits != null) {
            const [sxlim, sylim] = limits;
            this._set_extent(sxlim, sylim, append, emit);
        }
    }
    _doubletap(ev) {
        if (!this.model.active)
            return;
        if (this._draw_basepoint != null) {
            this._update_box(ev, false, true);
            this._draw_basepoint = null;
        }
        else {
            this._draw_basepoint = [ev.sx, ev.sy];
            this._select_event(ev, "append", this.model.renderers);
            this._update_box(ev, true, false);
        }
    }
    _move(ev) {
        this._update_box(ev, false, false);
    }
    _pan_start(ev) {
        if (ev.shiftKey) {
            if (this._draw_basepoint != null)
                return;
            this._draw_basepoint = [ev.sx, ev.sy];
            this._update_box(ev, true, false);
        }
        else {
            if (this._basepoint != null)
                return;
            this._select_event(ev, "append", this.model.renderers);
            this._basepoint = [ev.sx, ev.sy];
        }
    }
    _pan(ev, append = false, emit = false) {
        if (ev.shiftKey) {
            if (this._draw_basepoint == null)
                return;
            this._update_box(ev, append, emit);
        }
        else {
            if (this._basepoint == null)
                return;
            this._drag_points(ev, this.model.renderers);
        }
    }
    _pan_end(ev) {
        this._pan(ev, false, true);
        if (ev.shiftKey) {
            this._draw_basepoint = null;
        }
        else {
            this._basepoint = null;
            for (const renderer of this.model.renderers)
                this._emit_cds_changes(renderer.data_source, false, true, true);
        }
    }
}
BoxEditToolView.__name__ = "BoxEditToolView";
export class BoxEditTool extends EditTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Box Edit Tool";
        this.icon = bk_tool_icon_box_edit;
        this.event_type = ["tap", "pan", "move"];
        this.default_order = 1;
    }
    static init_BoxEditTool() {
        this.prototype.default_view = BoxEditToolView;
        this.define({
            dimensions: [p.Dimensions, "both"],
            num_objects: [p.Int, 0],
        });
    }
}
BoxEditTool.__name__ = "BoxEditTool";
BoxEditTool.init_BoxEditTool();
//# sourceMappingURL=box_edit_tool.js.map