import { Markup, MarkupView } from "./markup";
import { pre } from "../../core/dom";
export class PreTextView extends MarkupView {
    render() {
        super.render();
        const content = pre({ style: { overflow: "auto" } }, this.model.text);
        this.markup_el.appendChild(content);
    }
}
PreTextView.__name__ = "PreTextView";
export class PreText extends Markup {
    constructor(attrs) {
        super(attrs);
    }
    static init_PreText() {
        this.prototype.default_view = PreTextView;
    }
}
PreText.__name__ = "PreText";
PreText.init_PreText();
//# sourceMappingURL=pretext.js.map