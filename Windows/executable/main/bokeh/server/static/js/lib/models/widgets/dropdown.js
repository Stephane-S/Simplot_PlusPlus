import { AbstractButton, AbstractButtonView } from "./abstract_button";
import { ButtonClick, MenuItemClick } from "../../core/bokeh_events";
import { div, display, undisplay } from "../../core/dom";
import * as p from "../../core/properties";
import { isString } from "../../core/util/types";
import { bk_below, bk_down } from "../../styles/mixins";
import { bk_dropdown_toggle } from "../../styles/buttons";
import { bk_menu, bk_caret, bk_divider } from "../../styles/menus";
import menus_css from "../../styles/menus.css";
export class DropdownView extends AbstractButtonView {
    constructor() {
        super(...arguments);
        this._open = false;
    }
    styles() {
        return [...super.styles(), menus_css];
    }
    render() {
        super.render();
        const caret = div({ class: [bk_caret, bk_down] });
        if (!this.model.is_split)
            this.button_el.appendChild(caret);
        else {
            const toggle = this._render_button(caret);
            toggle.classList.add(bk_dropdown_toggle);
            toggle.addEventListener("click", () => this._toggle_menu());
            this.group_el.appendChild(toggle);
        }
        const items = this.model.menu.map((item, i) => {
            if (item == null)
                return div({ class: bk_divider });
            else {
                const label = isString(item) ? item : item[0];
                const el = div({}, label);
                el.addEventListener("click", () => this._item_click(i));
                return el;
            }
        });
        this.menu = div({ class: [bk_menu, bk_below] }, items);
        this.el.appendChild(this.menu);
        undisplay(this.menu);
    }
    _show_menu() {
        if (!this._open) {
            this._open = true;
            display(this.menu);
            const listener = (event) => {
                const { target } = event;
                if (target instanceof HTMLElement && !this.el.contains(target)) {
                    document.removeEventListener("click", listener);
                    this._hide_menu();
                }
            };
            document.addEventListener("click", listener);
        }
    }
    _hide_menu() {
        if (this._open) {
            this._open = false;
            undisplay(this.menu);
        }
    }
    _toggle_menu() {
        if (this._open)
            this._hide_menu();
        else
            this._show_menu();
    }
    click() {
        if (!this.model.is_split)
            this._toggle_menu();
        else {
            this._hide_menu();
            this.model.trigger_event(new ButtonClick());
            super.click();
        }
    }
    _item_click(i) {
        this._hide_menu();
        const item = this.model.menu[i];
        if (item != null) {
            const value_or_callback = isString(item) ? item : item[1];
            if (isString(value_or_callback)) {
                this.model.trigger_event(new MenuItemClick(value_or_callback));
            }
            else {
                value_or_callback.execute(this.model, { index: i }); // TODO
            }
        }
    }
}
DropdownView.__name__ = "DropdownView";
export class Dropdown extends AbstractButton {
    constructor(attrs) {
        super(attrs);
    }
    static init_Dropdown() {
        this.prototype.default_view = DropdownView;
        this.define({
            split: [p.Boolean, false],
            menu: [p.Array, []],
        });
        this.override({
            label: "Dropdown",
        });
    }
    get is_split() {
        return this.split;
    }
}
Dropdown.__name__ = "Dropdown";
Dropdown.init_Dropdown();
//# sourceMappingURL=dropdown.js.map