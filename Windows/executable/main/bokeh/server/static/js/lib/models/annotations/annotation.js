import * as proj from "../../core/util/projections";
import { extend } from "../../core/util/object";
import { Renderer, RendererView } from "../renderers/renderer";
export class AnnotationView extends RendererView {
    get panel() {
        return this.layout;
    }
    connect_signals() {
        super.connect_signals();
        const p = this.model.properties;
        this.on_change(p.visible, () => this.plot_view.request_layout());
    }
    get_size() {
        if (this.model.visible) {
            const { width, height } = this._get_size();
            return { width: Math.round(width), height: Math.round(height) };
        }
        else
            return { width: 0, height: 0 };
    }
    _get_size() {
        throw new Error("not implemented");
    }
    set_data(source) {
        const data = this.model.materialize_dataspecs(source);
        extend(this, data);
        if (this.plot_model.use_map) {
            const self = this;
            if (self._x != null)
                [self._x, self._y] = proj.project_xy(self._x, self._y);
            if (self._xs != null)
                [self._xs, self._ys] = proj.project_xsys(self._xs, self._ys);
        }
    }
    get needs_clip() {
        return this.layout == null; // TODO: change this, when center layout is fully implemented
    }
    serializable_state() {
        const state = super.serializable_state();
        return this.layout == null ? state : Object.assign(Object.assign({}, state), { bbox: this.layout.bbox.box });
    }
}
AnnotationView.__name__ = "AnnotationView";
export class Annotation extends Renderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_Annotation() {
        this.override({
            level: 'annotation',
        });
    }
}
Annotation.__name__ = "Annotation";
Annotation.init_Annotation();
//# sourceMappingURL=annotation.js.map