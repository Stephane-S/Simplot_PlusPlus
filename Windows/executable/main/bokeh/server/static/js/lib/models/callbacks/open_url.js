import { Callback } from "./callback";
import { replace_placeholders } from "../../core/util/templating";
import { isString } from "../../core/util/types";
import * as p from "../../core/properties";
export class OpenURL extends Callback {
    constructor(attrs) {
        super(attrs);
    }
    static init_OpenURL() {
        this.define({
            url: [p.String, 'http://'],
            same_tab: [p.Boolean, false],
        });
    }
    execute(_cb_obj, { source }) {
        const open_url = (i) => {
            const url = replace_placeholders(this.url, source, i);
            if (!isString(url))
                throw new Error("HTML output is not supported in this context");
            if (this.same_tab)
                window.location.href = url;
            else
                window.open(url);
        };
        const { selected } = source;
        for (const i of selected.indices)
            open_url(i);
        for (const i of selected.line_indices)
            open_url(i);
        // TODO: multiline_indices: {[key: string]: number[]}
    }
}
OpenURL.__name__ = "OpenURL";
OpenURL.init_OpenURL();
//# sourceMappingURL=open_url.js.map