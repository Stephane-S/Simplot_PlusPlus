import { Callback } from "./callback";
import * as p from "../../core/properties";
import { keys, values } from "../../core/util/object";
import { use_strict } from "../../core/util/string";
export class CustomJS extends Callback {
    constructor(attrs) {
        super(attrs);
    }
    static init_CustomJS() {
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
        return new Function(...this.names, "cb_obj", "cb_data", code);
    }
    execute(cb_obj, cb_data = {}) {
        return this.func.apply(cb_obj, this.values.concat(cb_obj, cb_data));
    }
}
CustomJS.__name__ = "CustomJS";
CustomJS.init_CustomJS();
//# sourceMappingURL=customjs.js.map