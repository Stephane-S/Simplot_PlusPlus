import { inplace } from "../../core/util/projections";
import * as p from "../../core/properties";
import { Glyph, GlyphView } from "./glyph";
export class XYGlyphView extends GlyphView {
    _project_data() {
        inplace.project_xy(this._x, this._y);
    }
    _index_data(index) {
        const { data_size } = this;
        for (let i = 0; i < data_size; i++) {
            const x = this._x[i];
            const y = this._y[i];
            if (isNaN(x + y) || !isFinite(x + y))
                index.add_empty();
            else
                index.add(x, y, x, y);
        }
    }
    scenterxy(i) {
        return [this.sx[i], this.sy[i]];
    }
}
XYGlyphView.__name__ = "XYGlyphView";
export class XYGlyph extends Glyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_XYGlyph() {
        this.define({
            x: [p.XCoordinateSpec, { field: "x" }],
            y: [p.YCoordinateSpec, { field: "y" }],
        });
    }
}
XYGlyph.__name__ = "XYGlyph";
XYGlyph.init_XYGlyph();
//# sourceMappingURL=xy_glyph.js.map