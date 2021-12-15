import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
export class SpanView extends AnnotationView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.plot_view.request_paint(this));
    }
    _render() {
        const { location } = this.model;
        if (location == null) {
            return;
        }
        const { frame } = this.plot_view;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        const _calc_dim = (scale, view) => {
            if (this.model.location_units == 'data')
                return scale.compute(location);
            else
                return this.model.for_hover ? location : view.compute(location);
        };
        let height, sleft, stop, width;
        if (this.model.dimension == 'width') {
            stop = _calc_dim(yscale, frame.yview);
            sleft = frame.bbox.left;
            width = frame.bbox.width;
            height = this.model.properties.line_width.value();
        }
        else {
            stop = frame.bbox.top;
            sleft = _calc_dim(xscale, frame.xview);
            width = this.model.properties.line_width.value();
            height = frame.bbox.height;
        }
        const { ctx } = this.layer;
        ctx.save();
        ctx.beginPath();
        this.visuals.line.set_value(ctx);
        ctx.moveTo(sleft, stop);
        if (this.model.dimension == "width") {
            ctx.lineTo(sleft + width, stop);
        }
        else {
            ctx.lineTo(sleft, stop + height);
        }
        ctx.stroke();
        ctx.restore();
    }
}
SpanView.__name__ = "SpanView";
export class Span extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_Span() {
        this.prototype.default_view = SpanView;
        this.mixins(mixins.Line /*Scalar*/);
        this.define({
            render_mode: [p.RenderMode, 'canvas'],
            location: [p.Number, null],
            location_units: [p.SpatialUnits, 'data'],
            dimension: [p.Dimension, 'width'],
        });
        this.override({
            line_color: 'black',
        });
        this.internal({
            for_hover: [p.Boolean, false],
        });
    }
}
Span.__name__ = "Span";
Span.init_Span();
//# sourceMappingURL=span.js.map