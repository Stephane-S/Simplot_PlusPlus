import { AbstractButton, AbstractButtonView } from "./abstract_button";
import { classes } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_active } from "../../styles/mixins";
export class ToggleView extends AbstractButtonView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.active.change, () => this._update_active());
    }
    render() {
        super.render();
        this._update_active();
    }
    click() {
        this.model.active = !this.model.active;
        super.click();
    }
    _update_active() {
        classes(this.button_el).toggle(bk_active, this.model.active);
    }
}
ToggleView.__name__ = "ToggleView";
export class Toggle extends AbstractButton {
    constructor(attrs) {
        super(attrs);
    }
    static init_Toggle() {
        this.prototype.default_view = ToggleView;
        this.define({
            active: [p.Boolean, false],
        });
        this.override({
            label: "Toggle",
        });
    }
}
Toggle.__name__ = "Toggle";
Toggle.init_Toggle();
//# sourceMappingURL=toggle.js.map