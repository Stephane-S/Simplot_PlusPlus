import { Document } from "../document";
import * as embed from "../embed";
import * as models from "./models";
import { VectorSpec } from "../core/properties";
import { startsWith } from "../core/util/string";
import { isEqual } from "../core/util/eq";
import { some, every, includes } from "../core/util/array";
import { clone, keys, entries } from "../core/util/object";
import { isNumber, isString, isArray } from "../core/util/types";
import { enumerate } from "../core/util/iterator";
import { GlyphRenderer, Axis, Grid, Tool, Plot, CDSView } from "./models";
import { Legend } from "../models/annotations/legend";
export { gridplot } from "./gridplot";
export { rgb2hex as color } from "../core/util/color";
const _default_tools = ["pan", "wheel_zoom", "box_zoom", "save", "reset", "help"];
const _default_color = "#1f77b4";
const _default_alpha = 1.0;
function _with_default(value, default_value) {
    return value === undefined ? default_value : value;
}
export class Figure extends Plot {
    constructor(attrs = {}) {
        attrs = Object.assign({}, attrs);
        const tools = _with_default(attrs.tools, _default_tools);
        delete attrs.tools;
        const x_axis_type = _with_default(attrs.x_axis_type, "auto");
        const y_axis_type = _with_default(attrs.y_axis_type, "auto");
        delete attrs.x_axis_type;
        delete attrs.y_axis_type;
        const x_minor_ticks = attrs.x_minor_ticks != null ? attrs.x_minor_ticks : "auto";
        const y_minor_ticks = attrs.y_minor_ticks != null ? attrs.y_minor_ticks : "auto";
        delete attrs.x_minor_ticks;
        delete attrs.y_minor_ticks;
        const x_axis_location = attrs.x_axis_location != null ? attrs.x_axis_location : "below";
        const y_axis_location = attrs.y_axis_location != null ? attrs.y_axis_location : "left";
        delete attrs.x_axis_location;
        delete attrs.y_axis_location;
        const x_axis_label = attrs.x_axis_label != null ? attrs.x_axis_label : "";
        const y_axis_label = attrs.y_axis_label != null ? attrs.y_axis_label : "";
        delete attrs.x_axis_label;
        delete attrs.y_axis_label;
        const x_range = Figure._get_range(attrs.x_range);
        const y_range = Figure._get_range(attrs.y_range);
        delete attrs.x_range;
        delete attrs.y_range;
        const x_scale = attrs.x_scale != null ? attrs.x_scale : Figure._get_scale(x_range, x_axis_type);
        const y_scale = attrs.y_scale != null ? attrs.y_scale : Figure._get_scale(y_range, y_axis_type);
        delete attrs.x_scale;
        delete attrs.y_scale;
        super(Object.assign(Object.assign({}, attrs), { x_range, y_range, x_scale, y_scale }));
        this._process_axis_and_grid(x_axis_type, x_axis_location, x_minor_ticks, x_axis_label, x_range, 0);
        this._process_axis_and_grid(y_axis_type, y_axis_location, y_minor_ticks, y_axis_label, y_range, 1);
        this.add_tools(...this._process_tools(tools));
    }
    get xgrid() {
        return this.center.filter((r) => r instanceof Grid && r.dimension == 0);
    }
    get ygrid() {
        return this.center.filter((r) => r instanceof Grid && r.dimension == 1);
    }
    get xaxis() {
        return this.below.concat(this.above).filter((r) => r instanceof Axis);
    }
    get yaxis() {
        return this.left.concat(this.right).filter((r) => r instanceof Axis);
    }
    get legend() {
        const legends = this.panels.filter((r) => r instanceof Legend);
        if (legends.length == 0) {
            const legend = new Legend();
            this.add_layout(legend);
            return legend;
        }
        else {
            const [legend] = legends;
            return legend;
        }
    }
    annular_wedge(...args) {
        return this._glyph(models.AnnularWedge, "x,y,inner_radius,outer_radius,start_angle,end_angle", args);
    }
    annulus(...args) {
        return this._glyph(models.Annulus, "x,y,inner_radius,outer_radius", args);
    }
    arc(...args) {
        return this._glyph(models.Arc, "x,y,radius,start_angle,end_angle", args);
    }
    bezier(...args) {
        return this._glyph(models.Bezier, "x0,y0,x1,y1,cx0,cy0,cx1,cy1", args);
    }
    circle(...args) {
        return this._glyph(models.Circle, "x,y", args);
    }
    ellipse(...args) {
        return this._glyph(models.Ellipse, "x,y,width,height", args);
    }
    harea(...args) {
        return this._glyph(models.HArea, "x1,x2,y", args);
    }
    hbar(...args) {
        return this._glyph(models.HBar, "y,height,right,left", args);
    }
    hex_tile(...args) {
        return this._glyph(models.HexTile, "q,r", args);
    }
    image(...args) {
        return this._glyph(models.Image, "color_mapper,image,rows,cols,x,y,dw,dh", args);
    }
    image_rgba(...args) {
        return this._glyph(models.ImageRGBA, "image,rows,cols,x,y,dw,dh", args);
    }
    image_url(...args) {
        return this._glyph(models.ImageURL, "url,x,y,w,h", args);
    }
    line(...args) {
        return this._glyph(models.Line, "x,y", args);
    }
    multi_line(...args) {
        return this._glyph(models.MultiLine, "xs,ys", args);
    }
    multi_polygons(...args) {
        return this._glyph(models.MultiPolygons, "xs,ys", args);
    }
    oval(...args) {
        return this._glyph(models.Oval, "x,y,width,height", args);
    }
    patch(...args) {
        return this._glyph(models.Patch, "x,y", args);
    }
    patches(...args) {
        return this._glyph(models.Patches, "xs,ys", args);
    }
    quad(...args) {
        return this._glyph(models.Quad, "left,right,bottom,top", args);
    }
    quadratic(...args) {
        return this._glyph(models.Quadratic, "x0,y0,x1,y1,cx,cy", args);
    }
    ray(...args) {
        return this._glyph(models.Ray, "x,y,length", args);
    }
    rect(...args) {
        return this._glyph(models.Rect, "x,y,width,height", args);
    }
    segment(...args) {
        return this._glyph(models.Segment, "x0,y0,x1,y1", args);
    }
    step(...args) {
        return this._glyph(models.Step, "x,y,mode", args);
    }
    text(...args) {
        return this._glyph(models.Text, "x,y,text", args);
    }
    varea(...args) {
        return this._glyph(models.VArea, "x,y1,y2", args);
    }
    vbar(...args) {
        return this._glyph(models.VBar, "x,width,top,bottom", args);
    }
    wedge(...args) {
        return this._glyph(models.Wedge, "x,y,radius,start_angle,end_angle", args);
    }
    asterisk(...args) {
        return this._marker(models.Asterisk, args);
    }
    circle_cross(...args) {
        return this._marker(models.CircleCross, args);
    }
    circle_dot(...args) {
        return this._marker(models.CircleDot, args);
    }
    circle_x(...args) {
        return this._marker(models.CircleX, args);
    }
    circle_y(...args) {
        return this._marker(models.CircleY, args);
    }
    cross(...args) {
        return this._marker(models.Cross, args);
    }
    dash(...args) {
        return this._marker(models.Dash, args);
    }
    diamond(...args) {
        return this._marker(models.Diamond, args);
    }
    diamond_cross(...args) {
        return this._marker(models.DiamondCross, args);
    }
    diamond_dot(...args) {
        return this._marker(models.DiamondDot, args);
    }
    dot(...args) {
        return this._marker(models.Dot, args);
    }
    hex(...args) {
        return this._marker(models.Hex, args);
    }
    hex_dot(...args) {
        return this._marker(models.HexDot, args);
    }
    inverted_triangle(...args) {
        return this._marker(models.InvertedTriangle, args);
    }
    plus(...args) {
        return this._marker(models.Plus, args);
    }
    square(...args) {
        return this._marker(models.Square, args);
    }
    square_cross(...args) {
        return this._marker(models.SquareCross, args);
    }
    square_dot(...args) {
        return this._marker(models.SquareDot, args);
    }
    square_pin(...args) {
        return this._marker(models.SquarePin, args);
    }
    square_x(...args) {
        return this._marker(models.SquareX, args);
    }
    triangle(...args) {
        return this._marker(models.Triangle, args);
    }
    triangle_dot(...args) {
        return this._marker(models.TriangleDot, args);
    }
    triangle_pin(...args) {
        return this._marker(models.TrianglePin, args);
    }
    x(...args) {
        return this._marker(models.X, args);
    }
    y(...args) {
        return this._marker(models.Y, args);
    }
    scatter(...args) {
        return this._marker(models.Scatter, args);
    }
    _pop_visuals(cls, props, prefix = "", defaults = {}, override_defaults = {}) {
        const _split_feature_trait = function (ft) {
            const fta = ft.split('_', 2);
            if (fta.length == 2) {
                return fta;
            }
            else {
                return fta.concat(['']);
            }
        };
        const _is_visual = function (ft) {
            const [feature, trait] = _split_feature_trait(ft);
            return includes(['line', 'fill', 'text', 'global'], feature) && (trait !== '');
        };
        defaults = Object.assign({}, defaults);
        if (!defaults.hasOwnProperty('text_color')) {
            defaults.text_color = 'black';
        }
        const trait_defaults = {};
        if (!trait_defaults.hasOwnProperty('color')) {
            trait_defaults.color = _default_color;
        }
        if (!trait_defaults.hasOwnProperty('alpha')) {
            trait_defaults.alpha = _default_alpha;
        }
        const result = {};
        const traits = new Set();
        for (const pname of keys(cls.prototype._props)) {
            if (_is_visual(pname)) {
                const trait = _split_feature_trait(pname)[1];
                if (props.hasOwnProperty(prefix + pname)) {
                    result[pname] = props[prefix + pname];
                    delete props[prefix + pname];
                }
                else if (!cls.prototype._props.hasOwnProperty(trait) && props.hasOwnProperty(prefix + trait)) {
                    result[pname] = props[prefix + trait];
                }
                else if (override_defaults.hasOwnProperty(trait)) {
                    result[pname] = override_defaults[trait];
                }
                else if (defaults.hasOwnProperty(pname)) {
                    result[pname] = defaults[pname];
                }
                else if (trait_defaults.hasOwnProperty(trait)) {
                    result[pname] = trait_defaults[trait];
                }
                if (!cls.prototype._props.hasOwnProperty(trait)) {
                    traits.add(trait);
                }
            }
        }
        traits.forEach(function (_key, val, _obj) {
            delete props[prefix + val];
        });
        return result;
    }
    _find_uniq_name(data, name) {
        let i = 1;
        while (true) {
            const new_name = `${name}__${i}`;
            if (data[new_name] != null) {
                i += 1;
            }
            else {
                return new_name;
            }
        }
    }
    _fixup_values(cls, data, attrs) {
        for (const [name, value] of entries(attrs)) {
            const prop = cls.prototype._props[name];
            if (prop != null) {
                if (prop.type.prototype instanceof VectorSpec) {
                    if (value != null) {
                        if (isArray(value)) {
                            let field;
                            if (data[name] != null) {
                                if (data[name] !== value) {
                                    field = this._find_uniq_name(data, name);
                                    data[field] = value;
                                }
                                else {
                                    field = name;
                                }
                            }
                            else {
                                field = name;
                                data[field] = value;
                            }
                            attrs[name] = { field };
                        }
                        else if (isNumber(value) || isString(value)) { // or Date?
                            attrs[name] = { value };
                        }
                    }
                }
            }
        }
    }
    _glyph(cls, params_string, args) {
        const params = params_string.split(",");
        let attrs;
        if (args.length == 0) {
            attrs = {};
        }
        else if (args.length == 1) {
            attrs = Object.assign({}, args[0]);
        }
        else {
            if (args.length == params.length)
                attrs = {};
            else
                attrs = Object.assign({}, args[args.length - 1]);
            for (const [param, i] of enumerate(params)) {
                attrs[param] = args[i];
            }
        }
        const source = attrs.source != null ? attrs.source : new models.ColumnDataSource();
        const data = clone(source.data);
        delete attrs.source;
        const view = attrs.view != null ? attrs.view : new CDSView({ source });
        delete attrs.view;
        const legend = this._process_legend(attrs.legend, source);
        delete attrs.legend;
        const has_sglyph = some(Object.keys(attrs), key => startsWith(key, "selection_"));
        const has_hglyph = some(Object.keys(attrs), key => startsWith(key, "hover_"));
        const glyph_ca = this._pop_visuals(cls, attrs);
        const nsglyph_ca = this._pop_visuals(cls, attrs, "nonselection_", glyph_ca, { alpha: 0.1 });
        const sglyph_ca = has_sglyph ? this._pop_visuals(cls, attrs, "selection_", glyph_ca) : {};
        const hglyph_ca = has_hglyph ? this._pop_visuals(cls, attrs, "hover_", glyph_ca) : {};
        this._fixup_values(cls, data, glyph_ca);
        this._fixup_values(cls, data, nsglyph_ca);
        this._fixup_values(cls, data, sglyph_ca);
        this._fixup_values(cls, data, hglyph_ca);
        this._fixup_values(cls, data, attrs);
        source.data = data;
        const _make_glyph = (cls, attrs, extra_attrs) => {
            return new cls(Object.assign(Object.assign({}, attrs), extra_attrs));
        };
        const glyph = _make_glyph(cls, attrs, glyph_ca);
        const nsglyph = _make_glyph(cls, attrs, nsglyph_ca);
        const sglyph = has_sglyph ? _make_glyph(cls, attrs, sglyph_ca) : undefined;
        const hglyph = has_hglyph ? _make_glyph(cls, attrs, hglyph_ca) : undefined;
        const glyph_renderer = new GlyphRenderer({
            data_source: source,
            view,
            glyph,
            nonselection_glyph: nsglyph,
            selection_glyph: sglyph,
            hover_glyph: hglyph,
        });
        if (legend != null) {
            this._update_legend(legend, glyph_renderer);
        }
        this.add_renderers(glyph_renderer);
        return glyph_renderer;
    }
    _marker(cls, args) {
        return this._glyph(cls, "x,y", args);
    }
    static _get_range(range) {
        if (range == null) {
            return new models.DataRange1d();
        }
        if (range instanceof models.Range) {
            return range;
        }
        if (isArray(range)) {
            if (every(range, isString)) {
                const factors = range;
                return new models.FactorRange({ factors });
            }
            if (range.length == 2) {
                const [start, end] = range;
                return new models.Range1d({ start, end });
            }
        }
        throw new Error(`unable to determine proper range for: '${range}'`);
    }
    static _get_scale(range_input, axis_type) {
        if (range_input instanceof models.DataRange1d ||
            range_input instanceof models.Range1d) {
            switch (axis_type) {
                case null:
                case "auto":
                case "linear":
                case "datetime":
                case "mercator":
                    return new models.LinearScale();
                case "log":
                    return new models.LogScale();
            }
        }
        if (range_input instanceof models.FactorRange) {
            return new models.CategoricalScale();
        }
        throw new Error(`unable to determine proper scale for: '${range_input}'`);
    }
    _process_axis_and_grid(axis_type, axis_location, minor_ticks, axis_label, rng, dim) {
        const axis = this._get_axis(axis_type, rng, dim);
        if (axis != null) {
            if (axis instanceof models.LogAxis) {
                if (dim == 0) {
                    this.x_scale = new models.LogScale();
                }
                else {
                    this.y_scale = new models.LogScale();
                }
            }
            if (axis.ticker instanceof models.ContinuousTicker) {
                axis.ticker.num_minor_ticks = this._get_num_minor_ticks(axis, minor_ticks);
            }
            if (axis_label.length !== 0) {
                axis.axis_label = axis_label;
            }
            const grid = new models.Grid({ dimension: dim, ticker: axis.ticker });
            if (axis_location !== null) {
                this.add_layout(axis, axis_location);
            }
            this.add_layout(grid);
        }
    }
    _get_axis(axis_type, range, dim) {
        switch (axis_type) {
            case null:
                return null;
            case "linear":
                return new models.LinearAxis();
            case "log":
                return new models.LogAxis();
            case "datetime":
                return new models.DatetimeAxis();
            case "mercator": {
                const axis = new models.MercatorAxis();
                const dimension = dim == 0 ? "lon" : "lat";
                axis.ticker.dimension = dimension;
                axis.formatter.dimension = dimension;
                return axis;
            }
            case "auto":
                if (range instanceof models.FactorRange)
                    return new models.CategoricalAxis();
                else
                    return new models.LinearAxis(); // TODO: return models.DatetimeAxis (Date type)
            default:
                throw new Error("shouldn't have happened");
        }
    }
    _get_num_minor_ticks(axis, num_minor_ticks) {
        if (isNumber(num_minor_ticks)) {
            if (num_minor_ticks <= 1) {
                throw new Error("num_minor_ticks must be > 1");
            }
            return num_minor_ticks;
        }
        if (num_minor_ticks == null) {
            return 0;
        }
        if (num_minor_ticks === "auto") {
            return axis instanceof models.LogAxis ? 10 : 5;
        }
        throw new Error("shouldn't have happened");
    }
    _process_tools(tools) {
        if (isString(tools))
            tools = tools.split(/\s*,\s*/).filter((tool) => tool.length > 0);
        return tools.map((tool) => isString(tool) ? Tool.from_string(tool) : tool);
    }
    _process_legend(legend, source) {
        let legend_item_label = null;
        if (legend != null) {
            if (isString(legend)) {
                legend_item_label = { value: legend };
                if (source.columns() != null) {
                    if (includes(source.columns(), legend)) {
                        legend_item_label = { field: legend };
                    }
                }
            }
            else {
                legend_item_label = legend;
            }
        }
        return legend_item_label;
    }
    _update_legend(legend_item_label, glyph_renderer) {
        const { legend } = this;
        let added = false;
        for (const item of legend.items) {
            if (item.label != null && isEqual(item.label, legend_item_label)) {
                // XXX: remove this when vectorable properties are refined
                const label = item.label;
                if ("value" in label) {
                    item.renderers.push(glyph_renderer);
                    added = true;
                    break;
                }
                if ("field" in label && glyph_renderer.data_source == item.renderers[0].data_source) {
                    item.renderers.push(glyph_renderer);
                    added = true;
                    break;
                }
            }
        }
        if (!added) {
            const new_item = new models.LegendItem({ label: legend_item_label, renderers: [glyph_renderer] });
            legend.items.push(new_item);
        }
    }
}
Figure.__name__ = "Plot";
export function figure(attributes) {
    return new Figure(attributes);
}
export async function show(obj, target) {
    const doc = new Document();
    for (const item of isArray(obj) ? obj : [obj])
        doc.add_root(item);
    let element;
    if (target == null) {
        element = document.body;
    }
    else if (isString(target)) {
        const found = document.querySelector(target);
        if (found != null && found instanceof HTMLElement)
            element = found;
        else
            throw new Error(`'${target}' selector didn't match any elements`);
    }
    else if (target instanceof HTMLElement) {
        element = target;
    }
    else if (typeof $ !== 'undefined' && target instanceof $) {
        element = target[0];
    }
    else {
        throw new Error("target should be HTMLElement, string selector, $ or null");
    }
    const views = await embed.add_document_standalone(doc, element);
    return new Promise((resolve, _reject) => {
        const result = isArray(obj) ? views : views[0];
        if (doc.is_idle)
            resolve(result);
        else
            doc.idle.connect(() => resolve(result));
    });
}
//# sourceMappingURL=plotting.js.map