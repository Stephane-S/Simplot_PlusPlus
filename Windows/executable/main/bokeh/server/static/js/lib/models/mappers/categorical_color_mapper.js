import { cat_v_compute } from "./categorical_mapper";
import { ColorMapper } from "./color_mapper";
import * as p from "../../core/properties";
export class CategoricalColorMapper extends ColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    static init_CategoricalColorMapper() {
        this.define({
            factors: [p.Array],
            start: [p.Number, 0],
            end: [p.Number],
        });
    }
    _v_compute(data, values, palette, { nan_color }) {
        cat_v_compute(data, this.factors, palette, values, this.start, this.end, nan_color);
    }
}
CategoricalColorMapper.__name__ = "CategoricalColorMapper";
CategoricalColorMapper.init_CategoricalColorMapper();
//# sourceMappingURL=categorical_color_mapper.js.map