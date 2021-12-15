import * as p from "../../core/properties";
import { View } from "../../core/view";
import { min, max } from "../../core/util/array";
import { Model } from "../../model";
export class ToolView extends View {
    get plot_view() {
        return this.parent;
    }
    get plot_model() {
        return this.parent.model;
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.active.change, () => {
            if (this.model.active)
                this.activate();
            else
                this.deactivate();
        });
    }
    // activate is triggered by toolbar ui actions
    activate() { }
    // deactivate is triggered by toolbar ui actions
    deactivate() { }
}
ToolView.__name__ = "ToolView";
export class Tool extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_Tool() {
        this.prototype._known_aliases = new Map();
        this.internal({
            active: [p.Boolean, false],
        });
    }
    get synthetic_renderers() {
        return [];
    }
    // utility function to return a tool name, modified
    // by the active dimensions. Used by tools that have dimensions
    _get_dim_tooltip(name, dims) {
        switch (dims) {
            case "width": return `${name} (x-axis)`;
            case "height": return `${name} (y-axis)`;
            case "both": return name;
        }
    }
    // utility function to get limits along both dimensions, given
    // optional dimensional constraints
    _get_dim_limits([sx0, sy0], [sx1, sy1], frame, dims) {
        const hr = frame.bbox.h_range;
        let sxlim;
        if (dims == 'width' || dims == 'both') {
            sxlim = [min([sx0, sx1]), max([sx0, sx1])];
            sxlim = [max([sxlim[0], hr.start]), min([sxlim[1], hr.end])];
        }
        else
            sxlim = [hr.start, hr.end];
        const vr = frame.bbox.v_range;
        let sylim;
        if (dims == 'height' || dims == 'both') {
            sylim = [min([sy0, sy1]), max([sy0, sy1])];
            sylim = [max([sylim[0], vr.start]), min([sylim[1], vr.end])];
        }
        else
            sylim = [vr.start, vr.end];
        return [sxlim, sylim];
    }
    static register_alias(name, fn) {
        this.prototype._known_aliases.set(name, fn);
    }
    static from_string(name) {
        const fn = this.prototype._known_aliases.get(name);
        if (fn != null)
            return fn();
        else {
            const names = [...this.prototype._known_aliases.keys()];
            throw new Error(`unexpected tool name '${name}', possible tools are ${names.join(", ")}`);
        }
    }
}
Tool.__name__ = "Tool";
Tool.init_Tool();
//# sourceMappingURL=tool.js.map