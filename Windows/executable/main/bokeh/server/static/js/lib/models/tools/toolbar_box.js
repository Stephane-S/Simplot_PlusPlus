import * as p from "../../core/properties";
import { includes, sort_by } from "../../core/util/array";
import { keys, values, entries } from "../../core/util/object";
import { ToolbarBase } from "./toolbar_base";
import { ToolProxy } from "./tool_proxy";
import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
import { ContentBox } from "../../core/layout";
export class ProxyToolbar extends ToolbarBase {
    constructor(attrs) {
        super(attrs);
    }
    static init_ProxyToolbar() {
        this.define({
            toolbars: [p.Array, []],
        });
    }
    initialize() {
        super.initialize();
        this._merge_tools();
    }
    _merge_tools() {
        // Go through all the tools on the toolbar and replace them with
        // a proxy e.g. PanTool, BoxSelectTool, etc.
        this._proxied_tools = [];
        const inspectors = {};
        const actions = {};
        const gestures = {};
        const new_help_tools = [];
        const new_help_urls = [];
        for (const helptool of this.help) {
            if (!includes(new_help_urls, helptool.redirect)) {
                new_help_tools.push(helptool);
                new_help_urls.push(helptool.redirect);
            }
        }
        this._proxied_tools.push(...new_help_tools);
        this.help = new_help_tools;
        for (const [event_type, gesture] of entries(this.gestures)) {
            if (!(event_type in gestures)) {
                gestures[event_type] = {};
            }
            for (const tool of gesture.tools) {
                if (!(tool.type in gestures[event_type])) {
                    gestures[event_type][tool.type] = [];
                }
                gestures[event_type][tool.type].push(tool);
            }
        }
        for (const tool of this.inspectors) {
            if (!(tool.type in inspectors)) {
                inspectors[tool.type] = [];
            }
            inspectors[tool.type].push(tool);
        }
        for (const tool of this.actions) {
            if (!(tool.type in actions)) {
                actions[tool.type] = [];
            }
            actions[tool.type].push(tool);
        }
        // Add a proxy for each of the groups of tools.
        const make_proxy = (tools, active = false) => {
            const proxy = new ToolProxy({ tools, active });
            this._proxied_tools.push(proxy);
            return proxy;
        };
        for (const event_type of keys(gestures)) {
            const gesture = this.gestures[event_type];
            gesture.tools = [];
            for (const tool_type of keys(gestures[event_type])) {
                const tools = gestures[event_type][tool_type];
                if (tools.length > 0) {
                    if (event_type == 'multi') {
                        for (const tool of tools) {
                            const proxy = make_proxy([tool]);
                            gesture.tools.push(proxy);
                            this.connect(proxy.properties.active.change, () => this._active_change(proxy));
                        }
                    }
                    else {
                        const proxy = make_proxy(tools);
                        gesture.tools.push(proxy);
                        this.connect(proxy.properties.active.change, () => this._active_change(proxy));
                    }
                }
            }
        }
        this.actions = [];
        for (const [tool_type, tools] of entries(actions)) {
            if (tool_type == 'CustomAction') {
                for (const tool of tools)
                    this.actions.push(make_proxy([tool]));
            }
            else if (tools.length > 0) {
                this.actions.push(make_proxy(tools)); // XXX
            }
        }
        this.inspectors = [];
        for (const tools of values(inspectors)) {
            if (tools.length > 0)
                this.inspectors.push(make_proxy(tools, true)); // XXX
        }
        for (const [et, gesture] of entries(this.gestures)) {
            if (gesture.tools.length == 0)
                continue;
            gesture.tools = sort_by(gesture.tools, (tool) => tool.default_order);
            if (!(et == 'pinch' || et == 'scroll' || et == 'multi'))
                gesture.tools[0].active = true;
        }
    }
}
ProxyToolbar.__name__ = "ProxyToolbar";
ProxyToolbar.init_ProxyToolbar();
export class ToolbarBoxView extends LayoutDOMView {
    initialize() {
        this.model.toolbar.toolbar_location = this.model.toolbar_location;
        super.initialize();
    }
    get child_models() {
        return [this.model.toolbar]; // XXX
    }
    _update_layout() {
        this.layout = new ContentBox(this.child_views[0].el);
        const { toolbar } = this.model;
        if (toolbar.horizontal) {
            this.layout.set_sizing({
                width_policy: "fit", min_width: 100, height_policy: "fixed",
            });
        }
        else {
            this.layout.set_sizing({
                width_policy: "fixed", height_policy: "fit", min_height: 100,
            });
        }
    }
}
ToolbarBoxView.__name__ = "ToolbarBoxView";
export class ToolbarBox extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
    static init_ToolbarBox() {
        this.prototype.default_view = ToolbarBoxView;
        this.define({
            toolbar: [p.Instance],
            toolbar_location: [p.Location, "right"],
        });
    }
}
ToolbarBox.__name__ = "ToolbarBox";
ToolbarBox.init_ToolbarBox();
//# sourceMappingURL=toolbar_box.js.map