import { ContinuousColorMapper } from "./continuous_color_mapper";
import { min, max } from "../../core/util/arrayable";
export class LogColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    scan(data, n) {
        const low = this.low != null ? this.low : min(data);
        const high = this.high != null ? this.high : max(data);
        const scale = n / (Math.log(high) - Math.log(low)); // subtract the low offset
        return { max: high, min: low, scale };
    }
    cmap(d, palette, low_color, high_color, scan_data) {
        const max_key = palette.length - 1;
        if (d > scan_data.max) {
            return high_color;
        }
        // This handles the edge case where d == high, since the code below maps
        // values exactly equal to high to palette.length, which is greater than
        // max_key
        if (d == scan_data.max)
            return palette[max_key];
        else if (d < scan_data.min)
            return low_color;
        // Get the key
        const log = Math.log(d) - Math.log(scan_data.min); // subtract the low offset
        let key = Math.floor(log * scan_data.scale);
        // Deal with upper bound
        if (key > max_key) {
            key = max_key;
        }
        return palette[key];
    }
}
LogColorMapper.__name__ = "LogColorMapper";
//# sourceMappingURL=log_color_mapper.js.map