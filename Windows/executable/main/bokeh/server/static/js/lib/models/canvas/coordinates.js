export class CoordinateTransform {
    constructor(x_scale, y_scale) {
        this.x_scale = x_scale;
        this.y_scale = y_scale;
        this.x_range = this.x_scale.source_range;
        this.y_range = this.y_scale.source_range;
        this.ranges = [this.x_range, this.y_range];
        this.scales = [this.x_scale, this.y_scale];
    }
    map_to_screen(xs, ys) {
        const sxs = this.x_scale.v_compute(xs);
        const sys = this.y_scale.v_compute(ys);
        return [sxs, sys];
    }
    map_from_screen(sxs, sys) {
        const xs = this.x_scale.v_invert(sxs);
        const ys = this.y_scale.v_invert(sys);
        return [xs, ys];
    }
}
CoordinateTransform.__name__ = "CoordinateTransform";
//# sourceMappingURL=coordinates.js.map