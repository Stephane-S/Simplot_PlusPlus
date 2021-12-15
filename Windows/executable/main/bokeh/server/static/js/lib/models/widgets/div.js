import { Markup, MarkupView } from "./markup";
import * as p from "../../core/properties";
export class DivView extends MarkupView {
    render() {
        super.render();
        if (this.model.render_as_text)
            this.markup_el.textContent = this.model.text;
        else
            this.markup_el.innerHTML = this.model.text;
    }
}
DivView.__name__ = "DivView";
export class Div extends Markup {
    constructor(attrs) {
        super(attrs);
    }
    static init_Div() {
        this.prototype.default_view = DivView;
        this.define({
            render_as_text: [p.Boolean, false],
        });
    }
}
Div.__name__ = "Div";
Div.init_Div();
//# sourceMappingURL=div.js.map