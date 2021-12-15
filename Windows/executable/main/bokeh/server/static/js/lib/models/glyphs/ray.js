import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { generic_line_legend } from "./utils";
import { LineVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
export class RayView extends XYGlyphView {
    _map_data() {
        if (this.model.properties.length.units == "data")
            this.slength = this.sdist(this.renderer.xscale, this._x, this._length);
        else
            this.slength = this._length;
    }
    _render(ctx, indices, { sx, sy, slength, _angle }) {
        if (this.visuals.line.doit) {
            const width = this.renderer.plot_view.frame.bbox.width;
            const height = this.renderer.plot_view.frame.bbox.height;
            const inf_len = 2 * (width + height);
            for (let i = 0, end = slength.length; i < end; i++) {
                if (slength[i] == 0)
                    slength[i] = inf_len;
            }
            for (const i of indices) {
                if (isNaN(sx[i] + sy[i] + _angle[i] + slength[i]))
                    continue;
                ctx.translate(sx[i], sy[i]);
                ctx.rotate(_angle[i]);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(slength[i], 0);
                this.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
                ctx.rotate(-_angle[i]);
                ctx.translate(-sx[i], -sy[i]);
            }
        }
    }
    draw_legend_for_index(ctx, bbox, index) {
        generic_line_legend(this.visuals, ctx, bbox, index);
    }
}
RayView.__name__ = "RayView";
export class Ray extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_Ray() {
        this.prototype.default_view = RayView;
        this.mixins(LineVector);
        this.define({
            length: [p.DistanceSpec],
            angle: [p.AngleSpec],
        });
    }
}
Ray.__name__ = "Ray";
Ray.init_Ray();
//# sourceMappingURL=ray.js.map