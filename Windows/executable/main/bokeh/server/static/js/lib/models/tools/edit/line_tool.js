import * as p from "../../../core/properties";
import { isArray } from "../../../core/util/types";
import { EditTool, EditToolView } from "./edit_tool";
export class LineToolView extends EditToolView {
    _set_intersection(x, y) {
        const point_glyph = this.model.intersection_renderer.glyph;
        const point_cds = this.model.intersection_renderer.data_source;
        const [pxkey, pykey] = [point_glyph.x.field, point_glyph.y.field];
        if (pxkey) {
            if (isArray(x))
                point_cds.data[pxkey] = x;
            else
                point_glyph.x = { value: x };
        }
        if (pykey) {
            if (isArray(y))
                point_cds.data[pykey] = y;
            else
                point_glyph.y = { value: y };
        }
        this._emit_cds_changes(point_cds, true, true, false);
    }
    _hide_intersections() {
        this._set_intersection([], []);
    }
}
LineToolView.__name__ = "LineToolView";
export class LineTool extends EditTool {
    constructor(attrs) {
        super(attrs);
    }
    static init_LineTool() {
        this.prototype.default_view = LineToolView;
        this.define({
            intersection_renderer: [p.Instance],
        });
    }
}
LineTool.__name__ = "LineTool";
LineTool.init_LineTool();
//# sourceMappingURL=line_tool.js.map