import { ActionTool, ActionToolView } from "./action_tool";
import * as p from "../../../core/properties";
import { bk_tool_icon_help } from "../../../styles/icons";
export class HelpToolView extends ActionToolView {
    doit() {
        window.open(this.model.redirect);
    }
}
HelpToolView.__name__ = "HelpToolView";
export class HelpTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Help";
        this.icon = bk_tool_icon_help;
    }
    static init_HelpTool() {
        this.prototype.default_view = HelpToolView;
        this.define({
            help_tooltip: [p.String, 'Click the question mark to learn more about Bokeh plot tools.'],
            redirect: [p.String, 'https://docs.bokeh.org/en/latest/docs/user_guide/tools.html'],
        });
        this.register_alias("help", () => new HelpTool());
    }
    get tooltip() {
        return this.help_tooltip;
    }
}
HelpTool.__name__ = "HelpTool";
HelpTool.init_HelpTool();
//# sourceMappingURL=help_tool.js.map