import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
export class SlopeView extends AnnotationView {
    initialize() {
        super.initialize();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.plot_view.request_render());
    }
    _render() {
        const gradient = this.model.gradient;
        const y_intercept = this.model.y_intercept;
        if (gradient == null || y_intercept == null) {
            return;
        }
        const { frame } = this.plot_view;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        const sy_start = frame.bbox.top;
        const sy_end = sy_start + frame.bbox.height;
        const y_start = yscale.invert(sy_start);
        const y_end = yscale.invert(sy_end);
        const x_start = (y_start - y_intercept) / gradient;
        const x_end = (y_end - y_intercept) / gradient;
        const sx_start = xscale.compute(x_start);
        const sx_end = xscale.compute(x_end);
        const { ctx } = this.layer;
        ctx.save();
        ctx.beginPath();
        this.visuals.line.set_value(ctx);
        ctx.moveTo(sx_start, sy_start);
        ctx.lineTo(sx_end, sy_end);
        ctx.stroke();
        ctx.restore();
    }
}
SlopeView.__name__ = "SlopeView";
export class Slope extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_Slope() {
        this.prototype.default_view = SlopeView;
        this.mixins(mixins.Line /*Scalar*/);
        this.define({
            gradient: [p.Number, null],
            y_intercept: [p.Number, null],
        });
        this.override({
            line_color: 'black',
        });
    }
}
Slope.__name__ = "Slope";
Slope.init_Slope();
//# sourceMappingURL=slope.js.map