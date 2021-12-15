import { ActionTool, ActionToolView } from "./action_tool";
import { bk_tool_icon_reset } from "../../../styles/icons";
export class ResetToolView extends ActionToolView {
    doit() {
        this.plot_view.reset();
    }
}
ResetToolView.__name__ = "ResetToolView";
export class ResetTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Reset";
        this.icon = bk_tool_icon_reset;
    }
    static init_ResetTool() {
        this.prototype.default_view = ResetToolView;
        this.register_alias("reset", () => new ResetTool());
    }
}
ResetTool.__name__ = "ResetTool";
ResetTool.init_ResetTool();
//# sourceMappingURL=reset_tool.js.map