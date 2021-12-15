import { select, option, optgroup, empty, append } from "../../core/dom";
import { isString, isArray } from "../../core/util/types";
import { entries } from "../../core/util/object";
import * as p from "../../core/properties";
import { InputWidget, InputWidgetView } from "./input_widget";
import { bk_input } from "../../styles/widgets/inputs";
export class SelectView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        const { value, options } = this.model.properties;
        this.on_change(value, () => {
            this._update_value();
        });
        this.on_change(options, () => {
            empty(this.input_el);
            append(this.input_el, ...this.options_el());
        });
    }
    options_el() {
        function build_options(values) {
            return values.map((el) => {
                let value, label;
                if (isString(el))
                    value = label = el;
                else
                    [value, label] = el;
                return option({ value }, label);
            });
        }
        const { options } = this.model;
        if (isArray(options))
            return build_options(options);
        else
            return entries(options).map(([label, values]) => optgroup({ label }, build_options(values)));
    }
    render() {
        super.render();
        this.input_el = select({
            class: bk_input,
            name: this.model.name,
            disabled: this.model.disabled,
        }, this.options_el());
        this._update_value();
        this.input_el.addEventListener("change", () => this.change_input());
        this.group_el.appendChild(this.input_el);
    }
    change_input() {
        const value = this.input_el.value;
        this.model.value = value;
        super.change_input();
    }
    _update_value() {
        const { value } = this.model;
        if (value != null && value.length != 0) {
            this.input_el.value = this.model.value;
        }
    }
}
SelectView.__name__ = "SelectView";
export class Select extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_Select() {
        this.prototype.default_view = SelectView;
        this.define({
            value: [p.String, ''],
            options: [p.Any, []],
        });
    }
}
Select.__name__ = "Select";
Select.init_Select();
//# sourceMappingURL=selectbox.js.map