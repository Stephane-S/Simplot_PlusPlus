import { Keys } from "../../../core/dom";
import * as p from "../../../core/properties";
import { isArray } from "../../../core/util/types";
import { EditTool, EditToolView } from "./edit_tool";
import { bk_tool_icon_freehand_draw } from "../../../styles/icons";
export class FreehandDrawToolView extends EditToolView {
    _draw(ev, mode, emit = false) {
        if (!this.model.active)
            return;
        const renderer = this.model.renderers[0];
        const point = this._map_drag(ev.sx, ev.sy, renderer);
        if (point == null)
            return;
        const [x, y] = point;
        const cds = renderer.data_source;
        const glyph = renderer.glyph;
        const [xkey, ykey] = [glyph.xs.field, glyph.ys.field];
        if (mode == 'new') {
            this._pop_glyphs(cds, this.model.num_objects);
            if (xkey)
                cds.get_array(xkey).push([x]);
            if (ykey)
                cds.get_array(ykey).push([y]);
            this._pad_empty_columns(cds, [xkey, ykey]);
        }
        else if (mode == 'add') {
            if (xkey) {
                const xidx = cds.data[xkey].length - 1;
                let xs = cds.get_array(xkey)[xidx];
                if (!isArray(xs)) {
                    xs = Array.from(xs);
                    cds.data[xkey][xidx] = xs;
                }
                xs.push(x);
            }
            if (ykey) {
                const yidx = cds.data[ykey].length - 1;
                let ys = cds.get_array(ykey)[yidx];
                if (!isArray(ys)) {
                    ys = Array.from(ys);
                    cds.data[ykey][yidx] = ys;
                }
                ys.push(y);
            }
        }
        this._emit_cds_changes(cds, true, true, emit);
    }
    _pan_start(ev) {
        this._draw(ev, 'new');
    }
    _pan(ev) {
        this._draw(ev, 'add');
    }
    _pan_end(ev) {
        this._draw(ev, 'add', true);
    }
    _tap(ev) {
        this._select_event(ev, this._select_mode(ev), this.model.renderers);
    }
    _keyup(ev) {
        if (!this.model.active || !this._mouse_in_frame)
            return;
        for (const renderer of this.model.renderers) {
            if (ev.keyCode === Keys.Esc) {
                renderer.data_source.selection_manager.clear();
            }
            else if (ev.keyCode === Keys.Backspace) {
                this._delete_selected(renderer);
            }
        }
    }
}
FreehandDrawToolView.__name__ = "FreehandDrawToolView";
export class FreehandDrawTool extends EditTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Freehand Draw Tool";
        this.icon = bk_tool_icon_freehand_draw;
        this.event_type = ["pan", "tap"];
        this.default_order = 3;
    }
    static init_FreehandDrawTool() {
        this.prototype.default_view = FreehandDrawToolView;
        this.define({
            num_objects: [p.Int, 0],
        });
    }
}
FreehandDrawTool.__name__ = "FreehandDrawTool";
FreehandDrawTool.init_FreehandDrawTool();
//# sourceMappingURL=freehand_draw_tool.js.map