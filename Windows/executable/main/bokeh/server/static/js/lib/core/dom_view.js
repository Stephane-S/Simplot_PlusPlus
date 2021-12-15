import { View } from "./view";
import { createElement, remove } from "./dom";
export class DOMView extends View {
    initialize() {
        super.initialize();
        this.el = this._createElement();
    }
    remove() {
        remove(this.el);
        super.remove();
    }
    css_classes() {
        return [];
    }
    render() { }
    renderTo(element) {
        element.appendChild(this.el);
        this.render();
    }
    _createElement() {
        return createElement(this.tagName, { class: this.css_classes() });
    }
}
DOMView.__name__ = "DOMView";
DOMView.prototype.tagName = "div";
//# sourceMappingURL=dom_view.js.map