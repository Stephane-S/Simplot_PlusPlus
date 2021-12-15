import { cat_v_compute } from "./categorical_mapper";
import { Mapper } from "./mapper";
import * as p from "../../core/properties";
export class CategoricalPatternMapper extends Mapper {
    constructor(attrs) {
        super(attrs);
    }
    static init_CategoricalPatternMapper() {
        this.define({
            factors: [p.Array],
            patterns: [p.Array],
            start: [p.Number, 0],
            end: [p.Number],
            default_value: [p.HatchPatternType, " "],
        });
    }
    v_compute(xs) {
        const values = new Array(xs.length);
        cat_v_compute(xs, this.factors, this.patterns, values, this.start, this.end, this.default_value);
        return values;
    }
}
CategoricalPatternMapper.__name__ = "CategoricalPatternMapper";
CategoricalPatternMapper.init_CategoricalPatternMapper();
//# sourceMappingURL=categorical_pattern_mapper.js.map