import { TextAnnotation, TextAnnotationView } from "./text_annotation";
import { ColumnDataSource } from "../sources/column_data_source";
import * as mixins from "../../core/property_mixins";
import { div, display } from "../../core/dom";
import * as p from "../../core/properties";
export class LabelSetView extends TextAnnotationView {
    initialize() {
        super.initialize();
        this.set_data(this.model.source);
        if (this.model.render_mode == 'css') {
            for (let i = 0, end = this._text.length; i < end; i++) {
                const el = div({ style: { display: "none" } });
                this.el.appendChild(el);
            }
        }
    }
    connect_signals() {
        super.connect_signals();
        if (this.model.render_mode == 'css') {
            // dispatch CSS update immediately
            this.connect(this.model.change, () => {
                this.set_data(this.model.source);
                this.render();
            });
            this.connect(this.model.source.streaming, () => {
                this.set_data(this.model.source);
                this.render();
            });
            this.connect(this.model.source.patching, () => {
                this.set_data(this.model.source);
                this.render();
            });
            this.connect(this.model.source.change, () => {
                this.set_data(this.model.source);
                this.render();
            });
        }
        else {
            this.connect(this.model.change, () => {
                this.set_data(this.model.source);
                this.plot_view.request_render();
            });
            this.connect(this.model.source.streaming, () => {
                this.set_data(this.model.source);
                this.plot_view.request_render();
            });
            this.connect(this.model.source.patching, () => {
                this.set_data(this.model.source);
                this.plot_view.request_render();
            });
            this.connect(this.model.source.change, () => {
                this.set_data(this.model.source);
                this.plot_view.request_render();
            });
        }
    }
    set_data(source) {
        super.set_data(source);
        this.visuals.warm_cache(source);
    }
    _map_data() {
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        const panel = this.panel != null ? this.panel : this.plot_view.frame;
        const sx = this.model.x_units == "data" ? xscale.v_compute(this._x) : panel.xview.v_compute(this._x);
        const sy = this.model.y_units == "data" ? yscale.v_compute(this._y) : panel.yview.v_compute(this._y);
        return [sx, sy];
    }
    _render() {
        const draw = this.model.render_mode == 'canvas' ? this._v_canvas_text.bind(this) : this._v_css_text.bind(this);
        const { ctx } = this.layer;
        const [sx, sy] = this._map_data();
        for (let i = 0, end = this._text.length; i < end; i++) {
            draw(ctx, i, this._text[i], sx[i] + this._x_offset[i], sy[i] - this._y_offset[i], this._angle[i]);
        }
    }
    _get_size() {
        const { ctx } = this.layer;
        this.visuals.text.set_value(ctx);
        const { width, ascent } = ctx.measureText(this._text[0]);
        return { width, height: ascent };
    }
    _v_canvas_text(ctx, i, text, sx, sy, angle) {
        this.visuals.text.set_vectorize(ctx, i);
        const bbox_dims = this._calculate_bounding_box_dimensions(ctx, text);
        ctx.save();
        ctx.beginPath();
        ctx.translate(sx, sy);
        ctx.rotate(angle);
        ctx.rect(bbox_dims[0], bbox_dims[1], bbox_dims[2], bbox_dims[3]);
        if (this.visuals.background_fill.doit) {
            this.visuals.background_fill.set_vectorize(ctx, i);
            ctx.fill();
        }
        if (this.visuals.border_line.doit) {
            this.visuals.border_line.set_vectorize(ctx, i);
            ctx.stroke();
        }
        if (this.visuals.text.doit) {
            this.visuals.text.set_vectorize(ctx, i);
            ctx.fillText(text, 0, 0);
        }
        ctx.restore();
    }
    _v_css_text(ctx, i, text, sx, sy, angle) {
        const el = this.el.children[i];
        el.textContent = text;
        this.visuals.text.set_vectorize(ctx, i);
        const bbox_dims = this._calculate_bounding_box_dimensions(ctx, text);
        // attempt to support vector-style ("8 4 8") line dashing for css mode
        const ld = this.visuals.border_line.line_dash.value();
        const line_dash = ld.length < 2 ? "solid" : "dashed";
        this.visuals.border_line.set_vectorize(ctx, i);
        this.visuals.background_fill.set_vectorize(ctx, i);
        el.style.position = 'absolute';
        el.style.left = `${sx + bbox_dims[0]}px`;
        el.style.top = `${sy + bbox_dims[1]}px`;
        el.style.color = `${this.visuals.text.text_color.value()}`;
        el.style.opacity = `${this.visuals.text.text_alpha.value()}`;
        el.style.font = `${this.visuals.text.font_value()}`;
        el.style.lineHeight = "normal"; // needed to prevent ipynb css override
        if (angle) {
            el.style.transform = `rotate(${angle}rad)`;
        }
        if (this.visuals.background_fill.doit) {
            el.style.backgroundColor = `${this.visuals.background_fill.color_value()}`;
        }
        if (this.visuals.border_line.doit) {
            el.style.borderStyle = `${line_dash}`;
            el.style.borderWidth = `${this.visuals.border_line.line_width.value()}px`;
            el.style.borderColor = `${this.visuals.border_line.color_value()}`;
        }
        display(el);
    }
}
LabelSetView.__name__ = "LabelSetView";
export class LabelSet extends TextAnnotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_LabelSet() {
        this.prototype.default_view = LabelSetView;
        this.mixins([
            mixins.TextVector,
            ["border_", mixins.LineVector],
            ["background_", mixins.FillVector],
        ]);
        this.define({
            x: [p.NumberSpec],
            y: [p.NumberSpec],
            x_units: [p.SpatialUnits, 'data'],
            y_units: [p.SpatialUnits, 'data'],
            text: [p.StringSpec, { field: "text" }],
            angle: [p.AngleSpec, 0],
            x_offset: [p.NumberSpec, { value: 0 }],
            y_offset: [p.NumberSpec, { value: 0 }],
            source: [p.Instance, () => new ColumnDataSource()],
        });
        this.override({
            background_fill_color: null,
            border_line_color: null,
        });
    }
}
LabelSet.__name__ = "LabelSet";
LabelSet.init_LabelSet();
//# sourceMappingURL=label_set.js.map