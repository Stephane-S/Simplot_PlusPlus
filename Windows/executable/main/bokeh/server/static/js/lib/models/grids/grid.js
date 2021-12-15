import { GuideRenderer, GuideRendererView } from "../renderers/guide_renderer";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
import { isArray } from "../../core/util/types";
export class GridView extends GuideRendererView {
    _render() {
        const ctx = this.layer.ctx;
        ctx.save();
        this._draw_regions(ctx);
        this._draw_minor_grids(ctx);
        this._draw_grids(ctx);
        ctx.restore();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.request_render());
    }
    _draw_regions(ctx) {
        if (!this.visuals.band_fill.doit && !this.visuals.band_hatch.doit)
            return;
        this.visuals.band_fill.set_value(ctx);
        const [xs, ys] = this.grid_coords('major', false);
        for (let i = 0; i < xs.length - 1; i++) {
            if (i % 2 != 1)
                continue;
            const [sx0, sy0] = this.coordinates.map_to_screen(xs[i], ys[i]);
            const [sx1, sy1] = this.coordinates.map_to_screen(xs[i + 1], ys[i + 1]);
            if (this.visuals.band_fill.doit)
                ctx.fillRect(sx0[0], sy0[0], sx1[1] - sx0[0], sy1[1] - sy0[0]);
            this.visuals.band_hatch.doit2(ctx, i, () => {
                ctx.fillRect(sx0[0], sy0[0], sx1[1] - sx0[0], sy1[1] - sy0[0]);
            }, () => this.request_render());
        }
    }
    _draw_grids(ctx) {
        if (!this.visuals.grid_line.doit)
            return;
        const [xs, ys] = this.grid_coords('major');
        this._draw_grid_helper(ctx, this.visuals.grid_line, xs, ys);
    }
    _draw_minor_grids(ctx) {
        if (!this.visuals.minor_grid_line.doit)
            return;
        const [xs, ys] = this.grid_coords('minor');
        this._draw_grid_helper(ctx, this.visuals.minor_grid_line, xs, ys);
    }
    _draw_grid_helper(ctx, visuals, xs, ys) {
        visuals.set_value(ctx);
        ctx.beginPath();
        for (let i = 0; i < xs.length; i++) {
            const [sx, sy] = this.coordinates.map_to_screen(xs[i], ys[i]);
            ctx.moveTo(Math.round(sx[0]), Math.round(sy[0]));
            for (let i = 1; i < sx.length; i++) {
                ctx.lineTo(Math.round(sx[i]), Math.round(sy[i]));
            }
        }
        ctx.stroke();
    }
    // {{{ TODO: state
    ranges() {
        const i = this.model.dimension;
        const j = (i + 1) % 2;
        const { ranges } = this.coordinates;
        return [ranges[i], ranges[j]];
    }
    computed_bounds() {
        const [range] = this.ranges();
        const user_bounds = this.model.bounds;
        const range_bounds = [range.min, range.max];
        let start;
        let end;
        if (isArray(user_bounds)) {
            start = Math.min(user_bounds[0], user_bounds[1]);
            end = Math.max(user_bounds[0], user_bounds[1]);
            if (start < range_bounds[0])
                start = range_bounds[0];
            // XXX:
            //else if (start > range_bounds[1])
            //  start = null
            if (end > range_bounds[1])
                end = range_bounds[1];
            // XXX:
            //else if (end < range_bounds[0])
            //  end = null
        }
        else {
            [start, end] = range_bounds;
            for (const axis_view of this.plot_view.axis_views) {
                if (axis_view.dimension == this.model.dimension
                    && axis_view.model.x_range_name == this.model.x_range_name
                    && axis_view.model.y_range_name == this.model.y_range_name) {
                    [start, end] = axis_view.computed_bounds;
                }
            }
        }
        return [start, end];
    }
    grid_coords(location, exclude_ends = true) {
        const i = this.model.dimension;
        const j = (i + 1) % 2;
        const [range, cross_range] = this.ranges();
        let [start, end] = this.computed_bounds();
        [start, end] = [Math.min(start, end), Math.max(start, end)];
        const coords = [[], []];
        // TODO: (bev) using cross_range.min for cross_loc is a bit of a cheat. Since we
        // currently only support "straight line" grids, this should be OK for now. If
        // we ever want to support "curved" grids, e.g. for some projections, we may
        // have to communicate more than just a single cross location.
        const ticker = this.model.get_ticker();
        if (ticker == null) {
            return coords;
        }
        const ticks = ticker.get_ticks(start, end, range, cross_range.min, {})[location];
        const min = range.min;
        const max = range.max;
        const cmin = cross_range.min;
        const cmax = cross_range.max;
        if (!exclude_ends) {
            if (ticks[0] != min)
                ticks.splice(0, 0, min);
            if (ticks[ticks.length - 1] != max)
                ticks.push(max);
        }
        for (let ii = 0; ii < ticks.length; ii++) {
            if ((ticks[ii] == min || ticks[ii] == max) && exclude_ends)
                continue;
            const dim_i = [];
            const dim_j = [];
            const N = 2;
            for (let n = 0; n < N; n++) {
                const loc = cmin + (cmax - cmin) / (N - 1) * n;
                dim_i.push(ticks[ii]);
                dim_j.push(loc);
            }
            coords[i].push(dim_i);
            coords[j].push(dim_j);
        }
        return coords;
    }
}
GridView.__name__ = "GridView";
export class Grid extends GuideRenderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_Grid() {
        this.prototype.default_view = GridView;
        this.mixins([
            ["grid_", mixins.Line],
            ["minor_grid_", mixins.Line],
            ["band_", mixins.Fill],
            ["band_", mixins.Hatch],
        ]);
        this.define({
            bounds: [p.Any, 'auto'],
            dimension: [p.Any, 0],
            axis: [p.Instance],
            ticker: [p.Instance],
        });
        this.override({
            level: "underlay",
            band_fill_color: null,
            band_fill_alpha: 0,
            grid_line_color: '#e5e5e5',
            minor_grid_line_color: null,
        });
    }
    get_ticker() {
        if (this.ticker != null) {
            return this.ticker;
        }
        if (this.axis != null) {
            return this.axis.ticker;
        }
        return null;
    }
}
Grid.__name__ = "Grid";
Grid.init_Grid();
//# sourceMappingURL=grid.js.map