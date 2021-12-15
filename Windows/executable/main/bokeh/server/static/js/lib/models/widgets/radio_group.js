import { input, label, div, span } from "../../core/dom";
import { uniqueId } from "../../core/util/string";
import * as p from "../../core/properties";
import { InputGroup, InputGroupView } from "./input_group";
import { bk_inline } from "../../styles/mixins";
import { bk_input_group } from "../../styles/widgets/inputs";
export class RadioGroupView extends InputGroupView {
    render() {
        super.render();
        const group = div({ class: [bk_input_group, this.model.inline ? bk_inline : null] });
        this.el.appendChild(group);
        const name = uniqueId();
        const { active, labels } = this.model;
        this._inputs = [];
        for (let i = 0; i < labels.length; i++) {
            const radio = input({ type: `radio`, name, value: `${i}` });
            radio.addEventListener("change", () => this.change_active(i));
            this._inputs.push(radio);
            if (this.model.disabled)
                radio.disabled = true;
            if (i == active)
                radio.checked = true;
            const label_el = label({}, radio, span({}, labels[i]));
            group.appendChild(label_el);
        }
    }
    change_active(i) {
        this.model.active = i;
    }
}
RadioGroupView.__name__ = "RadioGroupView";
export class RadioGroup extends InputGroup {
    constructor(attrs) {
        super(attrs);
    }
    static init_RadioGroup() {
        this.prototype.default_view = RadioGroupView;
        this.define({
            active: [p.Number],
            labels: [p.Array, []],
            inline: [p.Boolean, false],
        });
    }
}
RadioGroup.__name__ = "RadioGroup";
RadioGroup.init_RadioGroup();
//# sourceMappingURL=radio_group.js.map