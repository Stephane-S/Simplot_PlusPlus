import { ButtonTool, ButtonToolView, ButtonToolButtonView } from "../button_tool";
import { Signal } from "../../../core/signaling";
export class ActionToolButtonView extends ButtonToolButtonView {
    _clicked() {
        this.model.do.emit(undefined);
    }
}
ActionToolButtonView.__name__ = "ActionToolButtonView";
export class ActionToolView extends ButtonToolView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.do, (arg) => this.doit(arg));
    }
}
ActionToolView.__name__ = "ActionToolView";
export class ActionTool extends ButtonTool {
    constructor(attrs) {
        super(attrs);
        this.button_view = ActionToolButtonView;
        this.do = new Signal(this, "do");
    }
}
ActionTool.__name__ = "ActionTool";
//# sourceMappingURL=action_tool.js.map