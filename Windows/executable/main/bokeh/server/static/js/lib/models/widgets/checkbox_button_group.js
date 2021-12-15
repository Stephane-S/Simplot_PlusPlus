import { ButtonGroup, ButtonGroupView } from "./button_group";
import { classes } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_active } from "../../styles/mixins";
export class CheckboxButtonGroupView extends ButtonGroupView {
    get active() {
        return new Set(this.model.active);
    }
    change_active(i) {
        const { active } = this;
        active.has(i) ? active.delete(i) : active.add(i);
        this.model.active = [...active].sort();
    }
    _update_active() {
        const { active } = this;
        this._buttons.forEach((button, i) => {
            classes(button).toggle(bk_active, active.has(i));
        });
    }
}
CheckboxButtonGroupView.__name__ = "CheckboxButtonGroupView";
export class CheckboxButtonGroup extends ButtonGroup {
    constructor(attrs) {
        super(attrs);
    }
    static init_CheckboxButtonGroup() {
        this.prototype.default_view = CheckboxButtonGroupView;
        this.define({
            active: [p.Array, []],
        });
    }
}
CheckboxButtonGroup.__name__ = "CheckboxButtonGroup";
CheckboxButtonGroup.init_CheckboxButtonGroup();
//# sourceMappingURL=checkbox_button_group.js.map