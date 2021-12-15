import { ButtonGroup, ButtonGroupView } from "./button_group";
import { classes } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_active } from "../../styles/mixins";
export class RadioButtonGroupView extends ButtonGroupView {
    change_active(i) {
        if (this.model.active !== i) {
            this.model.active = i;
        }
    }
    _update_active() {
        const { active } = this.model;
        this._buttons.forEach((button, i) => {
            classes(button).toggle(bk_active, active === i);
        });
    }
}
RadioButtonGroupView.__name__ = "RadioButtonGroupView";
export class RadioButtonGroup extends ButtonGroup {
    constructor(attrs) {
        super(attrs);
    }
    static init_RadioButtonGroup() {
        this.prototype.default_view = RadioButtonGroupView;
        this.define({
            active: [p.Any, null],
        });
    }
}
RadioButtonGroup.__name__ = "RadioButtonGroup";
RadioButtonGroup.init_RadioButtonGroup();
//# sourceMappingURL=radio_button_group.js.map