import { Filter } from "./filter";
import * as p from "../../core/properties";
import { Indices } from "../../core/types";
export class IndexFilter extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    static init_IndexFilter() {
        this.define({
            indices: [p.Array, null],
        });
    }
    compute_indices(source) {
        const size = source.length;
        const { indices } = this;
        if (indices == null) {
            return Indices.all_set(size);
        }
        else {
            return Indices.from_indices(size, indices);
        }
    }
}
IndexFilter.__name__ = "IndexFilter";
IndexFilter.init_IndexFilter();
//# sourceMappingURL=index_filter.js.map