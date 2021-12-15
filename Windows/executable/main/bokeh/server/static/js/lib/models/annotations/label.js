import { TextAnnotation, TextAnnotationView } from "./text_annotation";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
export class LabelView extends TextAnnotationView {
    initialize() {
        super.initialize();
        this.visuals.warm_cache();
    }
    _get_size() {
        const { ctx } = this.layer;
        this.visuals.text.set_value(ctx);
        const { width, ascent } = ctx.measureText(this.model.text);
        return { width, height: ascent };
    }
    _render() {
        // Here because AngleSpec does units transform and label doesn't support specs
        let angle;
        switch (this.model.angle_units) {
            case "rad": {
                angle = -this.model.angle;
                break;
            }
            case "deg": {
                angle = (-this.model.angle * Math.PI) / 180.0;
                break;
            }
        }
        const panel = this.panel != null ? this.panel : this.plot_view.frame;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        let sx = this.model.x_units == "data" ? xscale.compute(this.model.x) : panel.xview.compute(this.model.x);
        let sy = this.model.y_units == "data" ? yscale.compute(this.model.y) : panel.yview.compute(this.model.y);
        sx += this.model.x_offset;
        sy -= this.model.y_offset;
        const draw = this.model.render_mode == 'canvas' ? this._canvas_text.bind(this) : this._css_text.bind(this);
        draw(this.layer.ctx, this.model.text, sx, sy, angle);
    }
}
LabelView.__name__ = "LabelView";
export class Label extends TextAnnotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_Label() {
        this.prototype.default_view = LabelView;
        this.mixins([
            mixins.Text /*Scalar*/,
            ["border_", mixins.Line],
            ["background_", mixins.Fill],
        ]);
        this.define({
            x: [p.Number],
            x_units: [p.SpatialUnits, 'data'],
            y: [p.Number],
            y_units: [p.SpatialUnits, 'data'],
            text: [p.String],
            angle: [p.Angle, 0],
            angle_units: [p.AngleUnits, 'rad'],
            x_offset: [p.Number, 0],
            y_offset: [p.Number, 0],
        });
        this.override({
            background_fill_color: null,
            border_line_color: null,
        });
    }
}
Label.__name__ = "Label";
Label.init_Label();
//# sourceMappingURL=label.js.map