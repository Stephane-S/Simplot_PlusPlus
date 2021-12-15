import { Axis, AxisView } from "./axis";
import { CategoricalTicker } from "../tickers/categorical_ticker";
import { CategoricalTickFormatter } from "../formatters/categorical_tick_formatter";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
export class CategoricalAxisView extends AxisView {
    _paint(ctx, extents, tick_coords) {
        this._draw_group_separators(ctx, extents, tick_coords);
    }
    _draw_group_separators(ctx, _extents, _tick_coords) {
        const [range] = this.ranges;
        const [start, end] = this.computed_bounds;
        if (!range.tops || range.tops.length < 2 || !this.visuals.separator_line.doit)
            return;
        const dim = this.dimension;
        const alt = (dim + 1) % 2;
        const coords = [[], []];
        let ind = 0;
        for (let i = 0; i < range.tops.length - 1; i++) {
            let first, last;
            for (let j = ind; j < range.factors.length; j++) {
                if (range.factors[j][0] == range.tops[i + 1]) {
                    [first, last] = [range.factors[j - 1], range.factors[j]];
                    ind = j;
                    break;
                }
            }
            const pt = (range.synthetic(first) + range.synthetic(last)) / 2;
            if (pt > start && pt < end) {
                coords[dim].push(pt);
                coords[alt].push(this.loc);
            }
        }
        const tex = this._tick_label_extent();
        this._draw_ticks(ctx, coords, -3, (tex - 6), this.visuals.separator_line);
    }
    _draw_major_labels(ctx, extents, _tick_coords) {
        const info = this._get_factor_info();
        let standoff = extents.tick + this.model.major_label_standoff;
        for (let i = 0; i < info.length; i++) {
            const [labels, coords, orient, visuals] = info[i];
            this._draw_oriented_labels(ctx, labels, coords, orient, this.panel.side, standoff, visuals);
            standoff += extents.tick_label[i];
        }
    }
    _tick_label_extents() {
        const info = this._get_factor_info();
        const extents = [];
        for (const [labels, , orient, visuals] of info) {
            const extent = this._oriented_labels_extent(labels, orient, this.panel.side, this.model.major_label_standoff, visuals);
            extents.push(extent);
        }
        return extents;
    }
    _get_factor_info() {
        const [range] = this.ranges;
        const [start, end] = this.computed_bounds;
        const loc = this.loc;
        const ticks = this.model.ticker.get_ticks(start, end, range, loc, {});
        const coords = this.tick_coords;
        const info = [];
        if (range.levels == 1) {
            const major = ticks.major;
            const labels = this.model.formatter.doFormat(major, this);
            info.push([labels, coords.major, this.model.major_label_orientation, this.visuals.major_label_text]);
        }
        else if (range.levels == 2) {
            const major = ticks.major.map((x) => x[1]);
            const labels = this.model.formatter.doFormat(major, this);
            info.push([labels, coords.major, this.model.major_label_orientation, this.visuals.major_label_text]);
            info.push([ticks.tops, coords.tops, this.model.group_label_orientation, this.visuals.group_text]);
        }
        else if (range.levels == 3) {
            const major = ticks.major.map((x) => x[2]);
            const labels = this.model.formatter.doFormat(major, this);
            const mid_labels = ticks.mids.map((x) => x[1]);
            info.push([labels, coords.major, this.model.major_label_orientation, this.visuals.major_label_text]);
            info.push([mid_labels, coords.mids, this.model.subgroup_label_orientation, this.visuals.subgroup_text]);
            info.push([ticks.tops, coords.tops, this.model.group_label_orientation, this.visuals.group_text]);
        }
        return info;
    }
    // {{{ TODO: state
    get tick_coords() {
        const i = this.dimension;
        const j = (i + 1) % 2;
        const [range] = this.ranges;
        const [start, end] = this.computed_bounds;
        const ticks = this.model.ticker.get_ticks(start, end, range, this.loc, {});
        const coords = {
            major: [[], []],
            mids: [[], []],
            tops: [[], []],
            minor: [[], []],
        };
        coords.major[i] = ticks.major;
        coords.major[j] = ticks.major.map((_x) => this.loc);
        if (range.levels == 3) {
            coords.mids[i] = ticks.mids;
            coords.mids[j] = ticks.mids.map((_x) => this.loc);
        }
        if (range.levels > 1) {
            coords.tops[i] = ticks.tops;
            coords.tops[j] = ticks.tops.map((_x) => this.loc);
        }
        return coords;
    }
}
CategoricalAxisView.__name__ = "CategoricalAxisView";
export class CategoricalAxis extends Axis {
    constructor(attrs) {
        super(attrs);
    }
    static init_CategoricalAxis() {
        this.prototype.default_view = CategoricalAxisView;
        this.mixins([
            ["separator_", mixins.Line],
            ["group_", mixins.Text],
            ["subgroup_", mixins.Text],
        ]);
        this.define({
            group_label_orientation: [p.Any, "parallel"],
            subgroup_label_orientation: [p.Any, "parallel"],
        });
        this.override({
            ticker: () => new CategoricalTicker(),
            formatter: () => new CategoricalTickFormatter(),
            separator_line_color: "lightgrey",
            separator_line_width: 2,
            group_text_font_style: "bold",
            group_text_font_size: "11px",
            group_text_color: "grey",
            subgroup_text_font_style: "bold",
            subgroup_text_font_size: "11px",
        });
    }
}
CategoricalAxis.__name__ = "CategoricalAxis";
CategoricalAxis.init_CategoricalAxis();
//# sourceMappingURL=categorical_axis.js.map