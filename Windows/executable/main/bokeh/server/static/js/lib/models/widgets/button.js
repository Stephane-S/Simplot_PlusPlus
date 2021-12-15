import { AbstractButton, AbstractButtonView } from "./abstract_button";
import { ButtonClick } from "../../core/bokeh_events";
export class ButtonView extends AbstractButtonView {
    click() {
        this.model.trigger_event(new ButtonClick());
        super.click();
    }
}
ButtonView.__name__ = "ButtonView";
export class Button extends AbstractButton {
    constructor(attrs) {
        super(attrs);
    }
    static init_Button() {
        this.prototype.default_view = ButtonView;
        this.override({
            label: "Button",
        });
    }
}
Button.__name__ = "Button";
Button.init_Button();
//# sourceMappingURL=button.js.map