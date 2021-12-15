import { Annotation, AnnotationView } from "./annotation";
import { div, display, undisplay, empty, remove, classes } from "../../core/dom";
import * as p from "../../core/properties";
import { bk_tooltip, bk_tooltip_custom, bk_tooltip_arrow } from "../../styles/tooltips";
import { bk_left, bk_right, bk_above, bk_below } from "../../styles/mixins";
import tooltips_css from "../../styles/tooltips.css";
const arrow_size = 10; // XXX: keep in sync with less
export class TooltipView extends AnnotationView {
    initialize() {
        super.initialize();
        this.el = div({ class: bk_tooltip });
        undisplay(this.el);
        this.plot_view.canvas_view.add_overlay(this.el);
    }
    remove() {
        remove(this.el);
        super.remove();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.content.change, () => this.render());
        this.connect(this.model.properties.position.change, () => this._reposition());
    }
    styles() {
        return [...super.styles(), tooltips_css];
    }
    render() {
        if (!this.model.visible)
            undisplay(this.el);
        super.render();
    }
    _render() {
        const { content } = this.model;
        if (content == null) {
            undisplay(this.el);
            return;
        }
        empty(this.el);
        classes(this.el).toggle(bk_tooltip_custom, this.model.custom);
        this.el.appendChild(content);
        if (this.model.show_arrow)
            this.el.classList.add(bk_tooltip_arrow);
    }
    _reposition() {
        const { position } = this.model;
        if (position == null) {
            undisplay(this.el);
            return;
        }
        const [sx, sy] = position;
        const side = (() => {
            const area = this.parent.layout.bbox.relativize();
            const { attachment } = this.model;
            switch (attachment) {
                case "horizontal":
                    return sx < area.hcenter ? "right" : "left";
                case "vertical":
                    return sy < area.vcenter ? "below" : "above";
                default:
                    return attachment;
            }
        })();
        this.el.classList.remove(bk_right);
        this.el.classList.remove(bk_left);
        this.el.classList.remove(bk_above);
        this.el.classList.remove(bk_below);
        display(this.el); // XXX: {offset,client}Width() gives 0 when display="none"
        // slightly confusing: side "left" (for example) is relative to point that
        // is being annotated but CS class ".bk-left" is relative to the tooltip itself
        let top;
        let left = null;
        let right = null;
        switch (side) {
            case "right":
                this.el.classList.add(bk_left);
                left = sx + (this.el.offsetWidth - this.el.clientWidth) + arrow_size;
                top = sy - this.el.offsetHeight / 2;
                break;
            case "left":
                this.el.classList.add(bk_right);
                right = (this.plot_view.layout.bbox.width - sx) + arrow_size;
                top = sy - this.el.offsetHeight / 2;
                break;
            case "below":
                this.el.classList.add(bk_above);
                top = sy + (this.el.offsetHeight - this.el.clientHeight) + arrow_size;
                left = Math.round(sx - this.el.offsetWidth / 2);
                break;
            case "above":
                this.el.classList.add(bk_below);
                top = sy - this.el.offsetHeight - arrow_size;
                left = Math.round(sx - this.el.offsetWidth / 2);
                break;
        }
        this.el.style.top = `${top}px`;
        this.el.style.left = left != null ? `${left}px` : "auto";
        this.el.style.right = right != null ? `${right}px` : "auto";
    }
}
TooltipView.__name__ = "TooltipView";
export class Tooltip extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_Tooltip() {
        this.prototype.default_view = TooltipView;
        this.define({
            attachment: [p.TooltipAttachment, 'horizontal'],
            inner_only: [p.Boolean, true],
            show_arrow: [p.Boolean, true],
        });
        this.override({
            level: 'overlay',
        });
        this.internal({
            position: [p.Any, null],
            content: [p.Any, () => div()],
            custom: [p.Any],
        });
    }
    clear() {
        this.position = null;
    }
}
Tooltip.__name__ = "Tooltip";
Tooltip.init_Tooltip();
//# sourceMappingURL=tooltip.js.map