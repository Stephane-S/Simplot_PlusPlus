import * as p from "../../core/properties";
import { Signal0 } from "../../core/signaling";
import { Model } from "../../model";
import { InspectTool } from "./inspectors/inspect_tool";
import { enumerate } from "../../core/util/iterator";
export class ToolProxy extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_ToolProxy() {
        this.define({
            tools: [p.Array, []],
            active: [p.Boolean, false],
            disabled: [p.Boolean, false],
        });
    }
    // Operates all the tools given only one button
    get button_view() {
        return this.tools[0].button_view;
    }
    get event_type() {
        return this.tools[0].event_type;
    }
    get tooltip() {
        return this.tools[0].tooltip;
    }
    get tool_name() {
        return this.tools[0].tool_name;
    }
    get icon() {
        return this.tools[0].computed_icon;
    }
    get computed_icon() {
        return this.icon;
    }
    get toggleable() {
        const tool = this.tools[0];
        return tool instanceof InspectTool && tool.toggleable;
    }
    initialize() {
        super.initialize();
        this.do = new Signal0(this, "do");
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.do, () => this.doit());
        this.connect(this.properties.active.change, () => this.set_active());
        for (const tool of this.tools) {
            this.connect(tool.properties.active.change, () => {
                this.active = tool.active;
            });
        }
    }
    doit() {
        for (const tool of this.tools) {
            tool.do.emit();
        }
    }
    set_active() {
        for (const tool of this.tools) {
            tool.active = this.active;
        }
    }
    get menu() {
        const { menu } = this.tools[0];
        if (menu == null)
            return null;
        const items = [];
        for (const [item, i] of enumerate(menu)) {
            if (item == null)
                items.push(null);
            else {
                const handler = () => {
                    var _a, _b;
                    for (const tool of this.tools) {
                        (_b = (_a = tool.menu) === null || _a === void 0 ? void 0 : _a[i]) === null || _b === void 0 ? void 0 : _b.handler();
                    }
                };
                items.push(Object.assign(Object.assign({}, item), { handler }));
            }
        }
        return items;
    }
}
ToolProxy.__name__ = "ToolProxy";
ToolProxy.init_ToolProxy();
//# sourceMappingURL=tool_proxy.js.map