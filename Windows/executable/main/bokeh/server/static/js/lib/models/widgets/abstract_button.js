import * as p from "../../core/properties";
import { prepend, nbsp, button, div } from "../../core/dom";
import { build_view } from "../../core/build_views";
import { Control, ControlView } from "./control";
import { bk_btn, bk_btn_group, bk_btn_type } from "../../styles/buttons";
import buttons_css from "../../styles/buttons.css";
export class AbstractButtonView extends ControlView {
    *controls() {
        yield this.button_el;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { icon } = this.model;
        if (icon != null) {
            this.icon_view = await build_view(icon, { parent: this });
        }
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.render());
    }
    remove() {
        if (this.icon_view != null)
            this.icon_view.remove();
        super.remove();
    }
    styles() {
        return [...super.styles(), buttons_css];
    }
    _render_button(...children) {
        return button({
            type: "button",
            disabled: this.model.disabled,
            class: [bk_btn, bk_btn_type(this.model.button_type)],
        }, ...children);
    }
    render() {
        super.render();
        this.button_el = this._render_button(this.model.label);
        this.button_el.addEventListener("click", () => this.click());
        if (this.icon_view != null) {
            prepend(this.button_el, this.icon_view.el, nbsp());
            this.icon_view.render();
        }
        this.group_el = div({ class: bk_btn_group }, this.button_el);
        this.el.appendChild(this.group_el);
    }
    click() { }
}
AbstractButtonView.__name__ = "AbstractButtonView";
export class AbstractButton extends Control {
    constructor(attrs) {
        super(attrs);
    }
    static init_AbstractButton() {
        this.define({
            label: [p.String, "Button"],
            icon: [p.Instance],
            button_type: [p.ButtonType, "default"],
        });
    }
}
AbstractButton.__name__ = "AbstractButton";
AbstractButton.init_AbstractButton();
//# sourceMappingURL=abstract_button.js.map