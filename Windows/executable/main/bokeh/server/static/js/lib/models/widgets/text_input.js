import { InputWidget, InputWidgetView } from "./input_widget";
import { input } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_input } from "../../styles/widgets/inputs";
export class TextInputView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.name.change, () => this.input_el.name = this.model.name || "");
        this.connect(this.model.properties.value.change, () => this.input_el.value = this.model.value);
        this.connect(this.model.properties.value_input.change, () => this.input_el.value = this.model.value_input);
        this.connect(this.model.properties.disabled.change, () => this.input_el.disabled = this.model.disabled);
        this.connect(this.model.properties.placeholder.change, () => this.input_el.placeholder = this.model.placeholder);
    }
    render() {
        super.render();
        this.input_el = input({
            type: "text",
            class: bk_input,
            name: this.model.name,
            value: this.model.value,
            disabled: this.model.disabled,
            placeholder: this.model.placeholder,
        });
        this.input_el.addEventListener("change", () => this.change_input());
        this.input_el.addEventListener("input", () => this.change_input_oninput());
        this.group_el.appendChild(this.input_el);
    }
    change_input() {
        this.model.value = this.input_el.value;
        super.change_input();
    }
    change_input_oninput() {
        this.model.value_input = this.input_el.value;
        super.change_input();
    }
}
TextInputView.__name__ = "TextInputView";
export class TextInput extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_TextInput() {
        this.prototype.default_view = TextInputView;
        this.define({
            value: [p.String, ""],
            value_input: [p.String, ""],
            placeholder: [p.String, ""],
        });
    }
}
TextInput.__name__ = "TextInput";
TextInput.init_TextInput();
//# sourceMappingURL=text_input.js.map