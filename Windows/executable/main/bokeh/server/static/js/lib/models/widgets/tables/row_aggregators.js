import { Data } from "@bokeh/slickgrid";
const { Avg, Min, Max, Sum } = Data.Aggregators;
import * as p from "../../../core/properties";
import { Model } from "../../../model";
export class RowAggregator extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_RowAggregator() {
        this.define({
            field_: [p.String, ''],
        });
    }
}
RowAggregator.__name__ = "RowAggregator";
RowAggregator.init_RowAggregator();
const avg = new Avg();
export class AvgAggregator extends RowAggregator {
    constructor() {
        super(...arguments);
        this.key = 'avg';
        this.init = avg.init;
        this.accumulate = avg.accumulate;
        this.storeResult = avg.storeResult;
    }
}
AvgAggregator.__name__ = "AvgAggregator";
const min = new Min();
export class MinAggregator extends RowAggregator {
    constructor() {
        super(...arguments);
        this.key = 'min';
        this.init = min.init;
        this.accumulate = min.accumulate;
        this.storeResult = min.storeResult;
    }
}
MinAggregator.__name__ = "MinAggregator";
const max = new Max();
export class MaxAggregator extends RowAggregator {
    constructor() {
        super(...arguments);
        this.key = 'max';
        this.init = max.init;
        this.accumulate = max.accumulate;
        this.storeResult = max.storeResult;
    }
}
MaxAggregator.__name__ = "MaxAggregator";
const sum = new Sum();
export class SumAggregator extends RowAggregator {
    constructor() {
        super(...arguments);
        this.key = 'sum';
        this.init = sum.init;
        this.accumulate = sum.accumulate;
        this.storeResult = sum.storeResult;
    }
}
SumAggregator.__name__ = "SumAggregator";
//# sourceMappingURL=row_aggregators.js.map