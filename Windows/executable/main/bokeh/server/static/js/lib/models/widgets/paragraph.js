import { Markup, MarkupView } from "./markup";
import { p as paragraph } from "../../core/dom";
export class ParagraphView extends MarkupView {
    render() {
        super.render();
        // This overrides default user-agent styling and helps layout work
        const content = paragraph({ style: { margin: 0 } }, this.model.text);
        this.markup_el.appendChild(content);
    }
}
ParagraphView.__name__ = "ParagraphView";
export class Paragraph extends Markup {
    constructor(attrs) {
        super(attrs);
    }
    static init_Paragraph() {
        this.prototype.default_view = ParagraphView;
    }
}
Paragraph.__name__ = "Paragraph";
Paragraph.init_Paragraph();
//# sourceMappingURL=paragraph.js.map