import { ButtonTool, ButtonToolView } from "../button_tool";
import { OnOffButtonView } from "../on_off_button";
import * as p from "../../../core/properties";
export class InspectToolView extends ButtonToolView {
}
InspectToolView.__name__ = "InspectToolView";
export class InspectTool extends ButtonTool {
    constructor(attrs) {
        super(attrs);
        this.event_type = "move";
    }
    static init_InspectTool() {
        this.prototype.button_view = OnOffButtonView;
        this.define({
            toggleable: [p.Boolean, true],
        });
        this.override({
            active: true,
        });
    }
}
InspectTool.__name__ = "InspectTool";
InspectTool.init_InspectTool();
//# sourceMappingURL=inspect_tool.js.map