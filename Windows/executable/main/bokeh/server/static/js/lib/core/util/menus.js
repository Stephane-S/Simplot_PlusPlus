import { div, classes, display, undisplay, empty, remove, Keys } from "../dom";
import { enumerate } from "./iterator";
//import menus_css from "styles/menus.css"
import * as styles from "../../styles/menus";
export class ContextMenu {
    constructor(items, options = {}) {
        this.items = items;
        this.options = options;
        this.el = div();
        this._open = false;
        this._item_click = (i) => {
            var _a;
            (_a = this.items[i]) === null || _a === void 0 ? void 0 : _a.handler();
            this.hide();
        };
        this._on_mousedown = (event) => {
            var _a, _b;
            const { target } = event;
            if (target instanceof Node && this.el.contains(target))
                return;
            if ((_b = (_a = this.options).prevent_hide) === null || _b === void 0 ? void 0 : _b.call(_a, event))
                return;
            this.hide();
        };
        this._on_keydown = (event) => {
            if (event.keyCode == Keys.Esc)
                this.hide();
        };
        this._on_blur = () => {
            this.hide();
        };
        undisplay(this.el);
    }
    get is_open() {
        return this._open;
    }
    get can_open() {
        return this.items.length != 0;
    }
    remove() {
        remove(this.el);
        this._unlisten();
    }
    _listen() {
        document.addEventListener("mousedown", this._on_mousedown);
        document.addEventListener("keydown", this._on_keydown);
        window.addEventListener("blur", this._on_blur);
    }
    _unlisten() {
        document.removeEventListener("mousedown", this._on_mousedown);
        document.removeEventListener("keydown", this._on_keydown);
        window.removeEventListener("blur", this._on_blur);
    }
    _position(at) {
        const parent_el = this.el.parentElement;
        if (parent_el != null) {
            const parent = parent_el.getBoundingClientRect();
            this.el.style.left = at.left != null ? `${at.left - parent.left}px` : "";
            this.el.style.top = at.top != null ? `${at.top - parent.top}px` : "";
            this.el.style.right = at.right != null ? `${parent.right - at.right}px` : "";
            this.el.style.bottom = at.bottom != null ? `${parent.bottom - at.bottom}px` : "";
        }
    }
    /*
    styles(): string[] {
      return [...super.styles(), menus_css]
    }
    */
    render() {
        var _a, _b;
        empty(this.el, true);
        const orientation = (_a = this.options.orientation) !== null && _a !== void 0 ? _a : "vertical";
        classes(this.el).add("bk-context-menu", `bk-${orientation}`);
        for (const [item, i] of enumerate(this.items)) {
            let el;
            if (item == null) {
                el = div({ class: styles.bk_divider });
            }
            else if (item.if != null && !item.if()) {
                continue;
            }
            else {
                const icon = item.icon != null ? div({ class: ["bk-menu-icon", item.icon] }) : null;
                el = div({ class: ((_b = item.active) === null || _b === void 0 ? void 0 : _b.call(item)) ? "bk-active" : null, title: item.tooltip }, icon, item.label);
            }
            el.addEventListener("click", () => this._item_click(i));
            this.el.appendChild(el);
        }
    }
    show(at) {
        if (this.items.length == 0)
            return;
        if (!this._open) {
            this.render();
            if (this.el.children.length == 0)
                return;
            this._position(at !== null && at !== void 0 ? at : { left: 0, top: 0 });
            display(this.el);
            this._listen();
            this._open = true;
        }
    }
    hide() {
        if (this._open) {
            this._open = false;
            this._unlisten();
            undisplay(this.el);
        }
    }
    toggle(at) {
        this._open ? this.hide() : this.show(at);
    }
}
ContextMenu.__name__ = "ContextMenu";
//# sourceMappingURL=menus.js.map