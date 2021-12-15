import { select, option } from "../../core/dom";
import { isString } from "../../core/util/types";
import * as p from "../../core/properties";
import { InputWidget, InputWidgetView } from "./input_widget";
import { bk_input } from "../../styles/widgets/inputs";
export class MultiSelectView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.value.change, () => this.render_selection());
        this.connect(this.model.properties.options.change, () => this.render());
        this.connect(this.model.properties.name.change, () => this.render());
        this.connect(this.model.properties.title.change, () => this.render());
        this.connect(this.model.properties.size.change, () => this.render());
        this.connect(this.model.properties.disabled.change, () => this.render());
    }
    render() {
        super.render();
        const options = this.model.options.map((opt) => {
            let value, _label;
            if (isString(opt))
                value = _label = opt;
            else
                [value, _label] = opt;
            return option({ value }, _label);
        });
        this.select_el = select({
            multiple: true,
            class: bk_input,
            name: this.model.name,
            disabled: this.model.disabled,
        }, options);
        this.select_el.addEventListener("change", () => this.change_input());
        this.group_el.appendChild(this.select_el);
        this.render_selection();
    }
    render_selection() {
        const selected = new Set(this.model.value);
        for (const el of this.el.querySelectorAll('option'))
            el.selected = selected.has(el.value);
        // Note that some browser implementations might not reduce
        // the number of visible options for size <= 3.
        this.select_el.size = this.model.size;
    }
    change_input() {
        const is_focused = this.el.querySelector('select:focus') != null;
        const values = [];
        for (const el of this.el.querySelectorAll('option')) {
            if (el.selected)
                values.push(el.value);
        }
        this.model.value = values;
        super.change_input();
        // Restore focus back to the <select> afterwards,
        // so that even if python on_change callback is invoked,
        // focus remains on <select> and one can seamlessly scroll
        // up/down.
        if (is_focused)
            this.select_el.focus();
    }
}
MultiSelectView.__name__ = "MultiSelectView";
export class MultiSelect extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_MultiSelect() {
        this.prototype.default_view = MultiSelectView;
        this.define({
            value: [p.Array, []],
            options: [p.Array, []],
            size: [p.Number, 4],
        });
    }
}
MultiSelect.__name__ = "MultiSelect";
MultiSelect.init_MultiSelect();
//# sourceMappingURL=multiselect.js.map