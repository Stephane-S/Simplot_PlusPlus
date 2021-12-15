import { Filter } from "./filter";
import * as p from "../../core/properties";
import { Indices } from "../../core/types";
import { keys, values } from "../../core/util/object";
import { isArrayOf, isBoolean, isInteger } from "../../core/util/types";
import { use_strict } from "../../core/util/string";
export class CustomJSFilter extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    static init_CustomJSFilter() {
        this.define({
            args: [p.Any, {}],
            code: [p.String, ''],
        });
    }
    get names() {
        return keys(this.args);
    }
    get values() {
        return values(this.args);
    }
    get func() {
        const code = use_strict(this.code);
        return new Function(...this.names, "source", code);
    }
    compute_indices(source) {
        const size = source.length;
        const filter = this.func(...this.values, source);
        if (filter == null)
            return Indices.all_set(size);
        else if (isArrayOf(filter, isInteger))
            return Indices.from_indices(size, filter);
        else if (isArrayOf(filter, isBoolean))
            return Indices.from_booleans(size, filter);
        else
            throw new Error(`expect an array of integers or booleans, or null, got ${filter}`);
    }
}
CustomJSFilter.__name__ = "CustomJSFilter";
CustomJSFilter.init_CustomJSFilter();
//# sourceMappingURL=customjs_filter.js.map