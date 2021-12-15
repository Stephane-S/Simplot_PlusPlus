import { InputWidget, InputWidgetView } from "./input_widget";
import { input } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_input } from "../../styles/widgets/inputs";
export class ColorPickerView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.name.change, () => this.input_el.name = this.model.name || "");
        this.connect(this.model.properties.color.change, () => this.input_el.value = this.model.color);
        this.connect(this.model.properties.disabled.change, () => this.input_el.disabled = this.model.disabled);
    }
    render() {
        super.render();
        this.input_el = input({
            type: "color",
            class: bk_input,
            name: this.model.name,
            value: this.model.color,
            disabled: this.model.disabled,
        });
        this.input_el.addEventListener("change", () => this.change_input());
        this.group_el.appendChild(this.input_el);
    }
    change_input() {
        this.model.color = this.input_el.value;
        super.change_input();
    }
}
ColorPickerView.__name__ = "ColorPickerView";
export class ColorPicker extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_ColorPicker() {
        this.prototype.default_view = ColorPickerView;
        this.define({
            color: [p.Color, "#000000"],
        });
    }
}
ColorPicker.__name__ = "ColorPicker";
ColorPicker.init_ColorPicker();
//# sourceMappingURL=color_picker.js.map