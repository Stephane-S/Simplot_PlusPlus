import { ContinuousColorMapper } from "./continuous_color_mapper";
import { left_edge_index } from "../../core/util/arrayable";
export class ScanningColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    cmap(d, palette, low_color, high_color, edges) {
        if (d < edges.binning[0])
            return low_color;
        if (d > edges.binning[edges.binning.length - 1])
            return high_color;
        const key = left_edge_index(d, edges.binning);
        return palette[key];
    }
}
ScanningColorMapper.__name__ = "ScanningColorMapper";
//# sourceMappingURL=scanning_color_mapper.js.map