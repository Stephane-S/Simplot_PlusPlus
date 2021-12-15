import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { generic_area_legend } from "./utils";
import * as hittest from "../../core/hittest";
import * as mixins from "../../core/property_mixins";
import { Selection } from "../selections/selection";
export class PatchView extends XYGlyphView {
    _inner_loop(ctx, indices, sx, sy, func) {
        for (const i of indices) {
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(sx[i], sy[i]);
                continue;
            }
            else if (isNaN(sx[i] + sy[i])) {
                ctx.closePath();
                func.apply(ctx);
                ctx.beginPath();
                continue;
            }
            else
                ctx.lineTo(sx[i], sy[i]);
        }
        ctx.closePath();
        func.call(ctx);
    }
    _render(ctx, indices, { sx, sy }) {
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            this._inner_loop(ctx, indices, sx, sy, ctx.fill);
        }
        this.visuals.hatch.doit2(ctx, 0, () => this._inner_loop(ctx, indices, sx, sy, ctx.fill), () => this.renderer.request_render());
        if (this.visuals.line.doit) {
            this.visuals.line.set_value(ctx);
            this._inner_loop(ctx, indices, sx, sy, ctx.stroke);
        }
    }
    draw_legend_for_index(ctx, bbox, index) {
        generic_area_legend(this.visuals, ctx, bbox, index);
    }
    _hit_point(geometry) {
        const result = new Selection();
        if (hittest.point_in_poly(geometry.sx, geometry.sy, this.sx, this.sy)) {
            result.add_to_selected_glyphs(this.model);
            result.view = this;
        }
        return result;
    }
}
PatchView.__name__ = "PatchView";
export class Patch extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
    static init_Patch() {
        this.prototype.default_view = PatchView;
        this.mixins([mixins.Line /*Scalar*/, mixins.Fill /*Scalar*/, mixins.Hatch /*Scalar*/]);
    }
}
Patch.__name__ = "Patch";
Patch.init_Patch();
//# sourceMappingURL=patch.js.map