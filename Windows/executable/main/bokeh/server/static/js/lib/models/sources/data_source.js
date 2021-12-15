import { Model } from "../../model";
import { Selection } from "../selections/selection";
import * as p from "../../core/properties";
export class DataSource extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_DataSource() {
        this.define({
            selected: [p.Instance, () => new Selection()],
        });
    }
}
DataSource.__name__ = "DataSource";
DataSource.init_DataSource();
//# sourceMappingURL=data_source.js.map