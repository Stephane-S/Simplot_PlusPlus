import { Model } from "../../../model";
import * as p from "../../../core/properties";
import { keys, values } from "../../../core/util/object";
import { use_strict } from "../../../core/util/string";
export class CustomJSHover extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_CustomJSHover() {
        this.define({
            args: [p.Any, {}],
            code: [p.String, ""],
        });
    }
    get values() {
        return values(this.args);
    }
    /*protected*/ _make_code(valname, formatname, varsname, fn) {
        // this relies on keys(args) and values(args) returning keys and values
        // in the same order
        return new Function(...keys(this.args), valname, formatname, varsname, use_strict(fn));
    }
    format(value, format, special_vars) {
        const formatter = this._make_code("value", "format", "special_vars", this.code);
        return formatter(...this.values, value, format, special_vars);
    }
}
CustomJSHover.__name__ = "CustomJSHover";
CustomJSHover.init_CustomJSHover();
//# sourceMappingURL=customjs_hover.js.map