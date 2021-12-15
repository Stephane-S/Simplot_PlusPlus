import { TickFormatter } from "./tick_formatter";
import * as p from "../../core/properties";
import { keys, values } from "../../core/util/object";
import { use_strict } from "../../core/util/string";
export class FuncTickFormatter extends TickFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_FuncTickFormatter() {
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
    /*protected*/ _make_func() {
        const code = use_strict(this.code);
        return new Function("tick", "index", "ticks", ...this.names, code);
    }
    doFormat(ticks, _opts) {
        const cache = {};
        const func = this._make_func().bind(cache);
        return ticks.map((tick, index, ticks) => func(tick, index, ticks, ...this.values));
    }
}
FuncTickFormatter.__name__ = "FuncTickFormatter";
FuncTickFormatter.init_FuncTickFormatter();
//# sourceMappingURL=func_tick_formatter.js.map