import { ButtonToolButtonView } from "./button_tool";
import { bk_active } from "../../styles/mixins";
import { classes } from "../../core/dom";
export class OnOffButtonView extends ButtonToolButtonView {
    render() {
        super.render();
        classes(this.el).toggle(bk_active, this.model.active);
    }
    _clicked() {
        const { active } = this.model;
        this.model.active = !active;
    }
}
OnOffButtonView.__name__ = "OnOffButtonView";
//# sourceMappingURL=on_off_button.js.map