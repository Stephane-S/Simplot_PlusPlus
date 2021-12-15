import { Filter } from "./filter";
import * as p from "../../core/properties";
import { Indices } from "../../core/types";
import { logger } from "../../core/logging";
export class GroupFilter extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    static init_GroupFilter() {
        this.define({
            column_name: [p.String],
            group: [p.String],
        });
    }
    compute_indices(source) {
        const column = source.get_column(this.column_name);
        if (column == null) {
            logger.warn(`${this}: groupby column '${this.column_name}' not found in the data source`);
            return new Indices(source.length, 1);
        }
        else {
            const indices = new Indices(source.length);
            for (let i = 0; i < indices.size; i++) {
                if (column[i] === this.group)
                    indices.set(i);
            }
            return indices;
        }
    }
}
GroupFilter.__name__ = "GroupFilter";
GroupFilter.init_GroupFilter();
//# sourceMappingURL=group_filter.js.map