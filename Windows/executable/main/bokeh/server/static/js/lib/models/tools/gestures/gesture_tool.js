import { ButtonTool, ButtonToolView } from "../button_tool";
import { OnOffButtonView } from "../on_off_button";
export class GestureToolView extends ButtonToolView {
}
GestureToolView.__name__ = "GestureToolView";
export class GestureTool extends ButtonTool {
    constructor(attrs) {
        super(attrs);
        this.button_view = OnOffButtonView;
    }
}
GestureTool.__name__ = "GestureTool";
//# sourceMappingURL=gesture_tool.js.map