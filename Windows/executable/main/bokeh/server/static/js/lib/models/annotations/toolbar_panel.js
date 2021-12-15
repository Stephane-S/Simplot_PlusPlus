import { Annotation, AnnotationView } from "./annotation";
import { build_view } from "../../core/build_views";
import { div, empty, position, display, undisplay, remove } from "../../core/dom";
import { BBox } from "../../core/util/bbox";
import * as p from "../../core/properties";
export class ToolbarPanelView extends AnnotationView {
    constructor() {
        super(...arguments);
        this.rotate = true;
        this._invalidate_toolbar = true;
        this._previous_bbox = new BBox();
    }
    initialize() {
        super.initialize();
        this.el = div();
        this.plot_view.canvas_view.add_event(this.el);
    }
    async lazy_initialize() {
        this._toolbar_view = await build_view(this.model.toolbar, { parent: this });
        this.plot_view.visibility_callbacks.push((visible) => this._toolbar_view.set_visibility(visible));
    }
    remove() {
        this._toolbar_view.remove();
        remove(this.el);
        super.remove();
    }
    render() {
        if (!this.model.visible)
            undisplay(this.el);
        super.render();
    }
    _render() {
        // TODO: this should be handled by the layout
        const { bbox } = this.panel;
        if (!this._previous_bbox.equals(bbox)) {
            position(this.el, bbox);
            this._previous_bbox = bbox;
        }
        if (this._invalidate_toolbar) {
            this.el.style.position = "absolute";
            this.el.style.overflow = "hidden";
            this._toolbar_view.render();
            empty(this.el);
            this.el.appendChild(this._toolbar_view.el);
            this._invalidate_toolbar = false;
        }
        display(this.el);
    }
    _get_size() {
        const { tools, logo } = this.model.toolbar;
        return {
            width: tools.length * 30 + (logo != null ? 25 : 0),
            height: 30,
        };
    }
}
ToolbarPanelView.__name__ = "ToolbarPanelView";
export class ToolbarPanel extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_ToolbarPanel() {
        this.prototype.default_view = ToolbarPanelView;
        this.define({
            toolbar: [p.Instance],
        });
    }
}
ToolbarPanel.__name__ = "ToolbarPanel";
ToolbarPanel.init_ToolbarPanel();
//# sourceMappingURL=toolbar_panel.js.map