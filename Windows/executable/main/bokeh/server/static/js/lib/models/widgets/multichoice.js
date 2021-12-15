import Choices from "choices.js";
import { select } from "../../core/dom";
import { isString } from "../../core/util/types";
import { CachedVariadicBox } from "../../core/layout/html";
import * as p from "../../core/properties";
import { bk_input } from "../../styles/widgets/inputs";
import choices_css from "../../styles/widgets/choices.css";
import { InputWidget, InputWidgetView } from "./input_widget";
export class MultiChoiceView extends InputWidgetView {
    constructor() {
        super(...arguments);
        this._last_height = null;
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.disabled.change, () => this.set_disabled());
        const { value, max_items, option_limit, delete_button, placeholder, options, name, title } = this.model.properties;
        this.on_change([value, max_items, option_limit, delete_button, placeholder, options, name, title], () => this.render());
    }
    styles() {
        return [...super.styles(), choices_css];
    }
    _update_layout() {
        this.layout = new CachedVariadicBox(this.el);
        this.layout.set_sizing(this.box_sizing());
    }
    render() {
        super.render();
        this.select_el = select({
            multiple: true,
            class: bk_input,
            name: this.model.name,
            disabled: this.model.disabled,
        });
        this.group_el.appendChild(this.select_el);
        const selected = new Set(this.model.value);
        const choices = this.model.options.map((opt) => {
            let value, label;
            if (isString(opt))
                value = label = opt;
            else
                [value, label] = opt;
            return { value, label, selected: selected.has(value) };
        });
        const fill = this.model.solid ? "solid" : "light";
        const item = `choices__item ${fill}`;
        const button = `choices__button ${fill}`;
        const options = {
            choices,
            duplicateItemsAllowed: false,
            removeItemButton: this.model.delete_button,
            classNames: { item, button },
        };
        if (this.model.placeholder != null)
            options.placeholderValue = this.model.placeholder;
        if (this.model.max_items != null)
            options.maxItemCount = this.model.max_items;
        if (this.model.option_limit != null)
            options.renderChoiceLimit = this.model.option_limit;
        this.choice_el = new Choices(this.select_el, options);
        const height = () => this.choice_el.containerOuter.element.getBoundingClientRect().height;
        if (this._last_height != null && this._last_height != height()) {
            this.root.invalidate_layout();
        }
        this._last_height = height();
        this.select_el.addEventListener("change", () => this.change_input());
    }
    set_disabled() {
        if (this.model.disabled)
            this.choice_el.disable();
        else
            this.choice_el.enable();
    }
    change_input() {
        const is_focused = this.el.querySelector("select:focus") != null;
        const values = [];
        for (const el of this.el.querySelectorAll("option")) {
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
MultiChoiceView.__name__ = "MultiChoiceView";
export class MultiChoice extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_MultiChoice() {
        this.prototype.default_view = MultiChoiceView;
        this.define({
            value: [p.Array, []],
            options: [p.Array, []],
            max_items: [p.Number, null],
            delete_button: [p.Boolean, true],
            placeholder: [p.String, null],
            option_limit: [p.Number, null],
            solid: [p.Boolean, true],
        });
    }
}
MultiChoice.__name__ = "MultiChoice";
MultiChoice.init_MultiChoice();
//# sourceMappingURL=multichoice.js.map