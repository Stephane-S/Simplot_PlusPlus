import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { generic_line_legend } from "./utils";
import { LineVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
export class ArcView extends XYGlyphView {
    _map_data() {
        if (this.model.properties.radius.units == "data")
            this.sradius = this.sdist(this.renderer.xscale, this._x, this._radius);
        else
            this.sradius = this._radius;
    }
    _render(ctx, indices, { sx, sy, sradius, _start_angle, _end_angle }) {
        if (this.visuals.line.doit) {
            const direction = this.model.properties.direction.value();
            for (const i of indices) {
                if (isNaN(sx[i] + sy[i] + sradius[i] + _start_angle[i] + _end_angle[i]))
                    continue;
                ctx.beginPath();
                ctx.arc(sx[i], sy[i], sradius[i], _start_angle[i], _end_angle[i], direction);
                this.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
            }
        }
    }
    draw_legend_for_index(ctx, bbox, index) {
        generic_line_legend(this.visuals, ctx, bbox, index);
    }
}
ArcView.__name__ = "ArcView";
export class Arc extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_Arc() {
        this.prototype.default_view = ArcView;
        this.mixins(LineVector);
        this.define({
            direction: [p.Direction, 'anticlock'],
            radius: [p.DistanceSpec],
            start_angle: [p.AngleSpec],
            end_angle: [p.AngleSpec],
        });
    }
}
Arc.__name__ = "Arc";
Arc.init_Arc();
//# sourceMappingURL=arc.js.map