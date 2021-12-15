import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
import { Signal0 } from "../../core/signaling";
import { concat, remove_by } from "../../core/util/array";
import { values } from "../../core/util/object";
import { isArray } from "../../core/util/types";
import { LayoutDOM } from "../layouts/layout_dom";
import { Title } from "../annotations/title";
import { LinearScale } from "../scales/linear_scale";
import { Toolbar } from "../tools/toolbar";
import { ColumnDataSource } from "../sources/column_data_source";
import { GlyphRenderer } from "../renderers/glyph_renderer";
import { DataRange1d } from '../ranges/data_range1d';
import { PlotView } from "./plot_canvas";
export { PlotView };
export class Plot extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
    static init_Plot() {
        this.prototype.default_view = PlotView;
        this.mixins([
            ["outline_", mixins.Line],
            ["background_", mixins.Fill],
            ["border_", mixins.Fill],
        ]);
        this.define({
            toolbar: [p.Instance, () => new Toolbar()],
            toolbar_location: [p.Location, 'right'],
            toolbar_sticky: [p.Boolean, true],
            plot_width: [p.Number, 600],
            plot_height: [p.Number, 600],
            frame_width: [p.Number, null],
            frame_height: [p.Number, null],
            title: [p.Any, () => new Title({ text: "" })],
            title_location: [p.Location, 'above'],
            above: [p.Array, []],
            below: [p.Array, []],
            left: [p.Array, []],
            right: [p.Array, []],
            center: [p.Array, []],
            renderers: [p.Array, []],
            x_range: [p.Instance, () => new DataRange1d()],
            extra_x_ranges: [p.Any, {}],
            y_range: [p.Instance, () => new DataRange1d()],
            extra_y_ranges: [p.Any, {}],
            x_scale: [p.Instance, () => new LinearScale()],
            y_scale: [p.Instance, () => new LinearScale()],
            lod_factor: [p.Number, 10],
            lod_interval: [p.Number, 300],
            lod_threshold: [p.Number, 2000],
            lod_timeout: [p.Number, 500],
            hidpi: [p.Boolean, true],
            output_backend: [p.OutputBackend, "canvas"],
            min_border: [p.Number, 5],
            min_border_top: [p.Number, null],
            min_border_left: [p.Number, null],
            min_border_bottom: [p.Number, null],
            min_border_right: [p.Number, null],
            inner_width: [p.Number],
            inner_height: [p.Number],
            outer_width: [p.Number],
            outer_height: [p.Number],
            match_aspect: [p.Boolean, false],
            aspect_scale: [p.Number, 1],
            reset_policy: [p.ResetPolicy, "standard"],
        });
        this.override({
            outline_line_color: "#e5e5e5",
            border_fill_color: "#ffffff",
            background_fill_color: "#ffffff",
        });
    }
    // TODO: change this when we drop ES5 compatibility (https://github.com/microsoft/TypeScript/issues/338)
    get width() {
        // const width = super.width
        const width = this.properties.width.get_value();
        return width != null ? width : this.plot_width;
    }
    set width(width) {
        this.setv({ width, plot_width: width });
    }
    get height() {
        // const height = super.height
        const height = this.properties.height.get_value();
        return height != null ? height : this.plot_height;
    }
    set height(height) {
        this.setv({ height, plot_height: height });
    }
    _doc_attached() {
        super._doc_attached();
        this._push_changes([
            [this.properties.inner_height, null, this.inner_height],
            [this.properties.inner_width, null, this.inner_width],
        ]);
    }
    initialize() {
        super.initialize();
        this.reset = new Signal0(this, "reset");
        for (const xr of values(this.extra_x_ranges).concat(this.x_range)) {
            let plots = xr.plots;
            if (isArray(plots)) {
                plots = plots.concat(this);
                xr.setv({ plots }, { silent: true });
            }
        }
        for (const yr of values(this.extra_y_ranges).concat(this.y_range)) {
            let plots = yr.plots;
            if (isArray(plots)) {
                plots = plots.concat(this);
                yr.setv({ plots }, { silent: true });
            }
        }
    }
    add_layout(renderer, side = "center") {
        const renderers = this.properties[side].get_value();
        this.setv({ [side]: [...renderers, renderer] });
    }
    remove_layout(renderer) {
        const del = (items) => {
            remove_by(items, (item) => item == renderer);
        };
        del(this.left);
        del(this.right);
        del(this.above);
        del(this.below);
        del(this.center);
    }
    add_renderers(...renderers) {
        this.renderers = this.renderers.concat(renderers);
    }
    add_glyph(glyph, source = new ColumnDataSource(), extra_attrs = {}) {
        const attrs = Object.assign(Object.assign({}, extra_attrs), { data_source: source, glyph });
        const renderer = new GlyphRenderer(attrs);
        this.add_renderers(renderer);
        return renderer;
    }
    add_tools(...tools) {
        this.toolbar.tools = this.toolbar.tools.concat(tools);
    }
    get panels() {
        return [...this.side_panels, ...this.center];
    }
    get side_panels() {
        const { above, below, left, right } = this;
        return concat([above, below, left, right]);
    }
}
Plot.__name__ = "Plot";
Plot.init_Plot();
//# sourceMappingURL=plot.js.map