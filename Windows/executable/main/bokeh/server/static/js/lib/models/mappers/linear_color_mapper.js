import { ContinuousColorMapper } from "./continuous_color_mapper";
import { min, max } from "../../core/util/arrayable";
export class LinearColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    scan(data, n) {
        const low = this.low != null ? this.low : min(data);
        const high = this.high != null ? this.high : max(data);
        const norm_factor = 1 / (high - low);
        const normed_interval = 1 / n;
        return { max: high, min: low, norm_factor, normed_interval };
    }
    cmap(d, palette, low_color, high_color, scan_data) {
        // This handles the edge case where d == high, since the code below maps
        // values exactly equal to high to palette.length, which is greater than
        // max_key
        const max_key = palette.length - 1;
        if (d == scan_data.max) {
            return palette[max_key];
        }
        const normed_d = (d - scan_data.min) * scan_data.norm_factor;
        const key = Math.floor(normed_d / scan_data.normed_interval);
        if (key < 0)
            return low_color;
        else if (key > max_key)
            return high_color;
        else
            return palette[key];
    }
}
LinearColorMapper.__name__ = "LinearColorMapper";
//# sourceMappingURL=linear_color_mapper.js.map