import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import { Signal0 } from "../../core/signaling";
import * as p from "../../core/properties";
export class PolyAnnotationView extends AnnotationView {
    connect_signals() {
        super.connect_signals();
        // need to respond to either normal BB change events or silent
        // "data only updates" that tools might want to use
        this.connect(this.model.change, () => this.plot_view.request_render());
        this.connect(this.model.data_update, () => this.plot_view.request_render());
    }
    _render() {
        const { xs, ys } = this.model;
        if (xs.length != ys.length)
            return;
        if (xs.length < 3 || ys.length < 3)
            return;
        const { frame } = this.plot_view;
        const { ctx } = this.layer;
        for (let i = 0, end = xs.length; i < end; i++) {
            let sx;
            if (this.model.xs_units == 'screen')
                sx = this.model.screen ? xs[i] : frame.xview.compute(xs[i]);
            else
                throw new Error("not implemented");
            let sy;
            if (this.model.ys_units == 'screen')
                sy = this.model.screen ? ys[i] : frame.yview.compute(ys[i]);
            else
                throw new Error("not implemented");
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
            }
            else {
                ctx.lineTo(sx, sy);
            }
        }
        ctx.closePath();
        if (this.visuals.line.doit) {
            this.visuals.line.set_value(ctx);
            ctx.stroke();
        }
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            ctx.fill();
        }
    }
}
PolyAnnotationView.__name__ = "PolyAnnotationView";
export class PolyAnnotation extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_PolyAnnotation() {
        this.prototype.default_view = PolyAnnotationView;
        this.mixins([mixins.Line /*Scalar*/, mixins.Fill /*Scalar*/]);
        this.define({
            xs: [p.Array, []],
            xs_units: [p.SpatialUnits, 'data'],
            ys: [p.Array, []],
            ys_units: [p.SpatialUnits, 'data'],
        });
        this.internal({
            screen: [p.Boolean, false],
        });
        this.override({
            fill_color: "#fff9ba",
            fill_alpha: 0.4,
            line_color: "#cccccc",
            line_alpha: 0.3,
        });
    }
    initialize() {
        super.initialize();
        this.data_update = new Signal0(this, "data_update");
    }
    update({ xs, ys }) {
        this.setv({ xs, ys, screen: true }, { silent: true });
        this.data_update.emit();
    }
}
PolyAnnotation.__name__ = "PolyAnnotation";
PolyAnnotation.init_PolyAnnotation();
//# sourceMappingURL=poly_annotation.js.map