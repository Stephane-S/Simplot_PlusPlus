import { Filter } from "./filter";
import * as p from "../../core/properties";
import { Indices } from "../../core/types";
export class BooleanFilter extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    static init_BooleanFilter() {
        this.define({
            booleans: [p.Array, null],
        });
    }
    compute_indices(source) {
        const size = source.length;
        const { booleans } = this;
        if (booleans == null) {
            return Indices.all_set(size);
        }
        else {
            return Indices.from_booleans(size, booleans);
        }
    }
}
BooleanFilter.__name__ = "BooleanFilter";
BooleanFilter.init_BooleanFilter();
//# sourceMappingURL=boolean_filter.js.map