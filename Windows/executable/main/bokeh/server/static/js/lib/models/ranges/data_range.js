import { Range } from "./range";
import * as p from "../../core/properties";
export class DataRange extends Range {
    constructor(attrs) {
        super(attrs);
    }
    static init_DataRange() {
        this.define({
            names: [p.Array, []],
            renderers: [p.Array, []],
        });
    }
}
DataRange.__name__ = "DataRange";
DataRange.init_DataRange();
//# sourceMappingURL=data_range.js.map