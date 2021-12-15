import { CenterRotatable, CenterRotatableView } from "./center_rotatable";
import * as hittest from "../../core/hittest";
import { Selection } from "../selections/selection";
export class EllipseOvalView extends CenterRotatableView {
    _set_data() {
        this.max_w2 = 0;
        if (this.model.properties.width.units == "data")
            this.max_w2 = this.max_width / 2;
        this.max_h2 = 0;
        if (this.model.properties.height.units == "data")
            this.max_h2 = this.max_height / 2;
    }
    _map_data() {
        if (this.model.properties.width.units == "data")
            this.sw = this.sdist(this.renderer.xscale, this._x, this._width, 'center');
        else
            this.sw = this._width;
        if (this.model.properties.height.units == "data")
            this.sh = this.sdist(this.renderer.yscale, this._y, this._height, 'center');
        else
            this.sh = this._height;
    }
    _render(ctx, indices, { sx, sy, sw, sh, _angle }) {
        for (const i of indices) {
            if (isNaN(sx[i] + sy[i] + sw[i] + sh[i] + _angle[i]))
                continue;
            ctx.beginPath();
            ctx.ellipse(sx[i], sy[i], sw[i] / 2.0, sh[i] / 2.0, _angle[i], 0, 2 * Math.PI);
            if (this.visuals.fill.doit) {
                this.visuals.fill.set_vectorize(ctx, i);
                ctx.fill();
            }
            if (this.visuals.line.doit) {
                this.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
            }
        }
    }
    _hit_point(geometry) {
        let x0, x1, y0, y1, cond, sx0, sx1, sy0, sy1;
        const { sx, sy } = geometry;
        const x = this.renderer.xscale.invert(sx);
        const y = this.renderer.yscale.invert(sy);
        if (this.model.properties.width.units == "data") {
            x0 = x - this.max_width;
            x1 = x + this.max_width;
        }
        else {
            sx0 = sx - this.max_width;
            sx1 = sx + this.max_width;
            [x0, x1] = this.renderer.xscale.r_invert(sx0, sx1);
        }
        if (this.model.properties.height.units == "data") {
            y0 = y - this.max_height;
            y1 = y + this.max_height;
        }
        else {
            sy0 = sy - this.max_height;
            sy1 = sy + this.max_height;
            [y0, y1] = this.renderer.yscale.r_invert(sy0, sy1);
        }
        const candidates = this.index.indices({ x0, x1, y0, y1 });
        const indices = [];
        for (const i of candidates) {
            cond = hittest.point_in_ellipse(sx, sy, this._angle[i], this.sh[i] / 2, this.sw[i] / 2, this.sx[i], this.sy[i]);
            if (cond) {
                indices.push(i);
            }
        }
        return new Selection({ indices });
    }
    draw_legend_for_index(ctx, { x0, y0, x1, y1 }, index) {
        const len = index + 1;
        const sx = new Array(len);
        sx[index] = (x0 + x1) / 2;
        const sy = new Array(len);
        sy[index] = (y0 + y1) / 2;
        const scale = this.sw[index] / this.sh[index];
        const d = Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 0.8;
        const sw = new Array(len);
        const sh = new Array(len);
        if (scale > 1) {
            sw[index] = d;
            sh[index] = d / scale;
        }
        else {
            sw[index] = d * scale;
            sh[index] = d;
        }
        this._render(ctx, [index], { sx, sy, sw, sh, _angle: [0] }); // XXX
    }
    _bounds({ x0, x1, y0, y1 }) {
        return {
            x0: x0 - this.max_w2,
            x1: x1 + this.max_w2,
            y0: y0 - this.max_h2,
            y1: y1 + this.max_h2,
        };
    }
}
EllipseOvalView.__name__ = "EllipseOvalView";
export class EllipseOval extends CenterRotatable {
    constructor(attrs) {
        super(attrs);
    }
}
EllipseOval.__name__ = "EllipseOval";
//# sourceMappingURL=ellipse_oval.js.map