import { cat_v_compute } from "./categorical_mapper";
import { Mapper } from "./mapper";
import * as p from "../../core/properties";
export class CategoricalMarkerMapper extends Mapper {
    constructor(attrs) {
        super(attrs);
    }
    static init_CategoricalMarkerMapper() {
        this.define({
            factors: [p.Array],
            markers: [p.Array],
            start: [p.Number, 0],
            end: [p.Number],
            default_value: [p.MarkerType, "circle"],
        });
    }
    v_compute(xs) {
        const values = new Array(xs.length);
        cat_v_compute(xs, this.factors, this.markers, values, this.start, this.end, this.default_value);
        return values;
    }
}
CategoricalMarkerMapper.__name__ = "CategoricalMarkerMapper";
CategoricalMarkerMapper.init_CategoricalMarkerMapper();
//# sourceMappingURL=categorical_marker_mapper.js.map