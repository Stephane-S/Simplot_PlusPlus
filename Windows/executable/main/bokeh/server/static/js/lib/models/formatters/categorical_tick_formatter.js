import { TickFormatter } from "./tick_formatter";
import { copy } from "../../core/util/array";
export class CategoricalTickFormatter extends TickFormatter {
    constructor(attrs) {
        super(attrs);
    }
    doFormat(ticks, _opts) {
        return copy(ticks);
    }
}
CategoricalTickFormatter.__name__ = "CategoricalTickFormatter";
//# sourceMappingURL=categorical_tick_formatter.js.map