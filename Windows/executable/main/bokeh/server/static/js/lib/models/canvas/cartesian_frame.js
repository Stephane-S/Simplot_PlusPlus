import { CategoricalScale } from "../scales/categorical_scale";
import { ContinuousScale } from "../scales/continuous_scale";
import { LogScale } from "../scales/log_scale";
import { Range1d } from "../ranges/range1d";
import { DataRange1d } from "../ranges/data_range1d";
import { FactorRange } from "../ranges/factor_range";
import { LayoutItem } from "../../core/layout";
import { entries, to_object } from "../../core/util/object";
import { assert } from "../../core/util/assert";
export class CartesianFrame extends LayoutItem {
    constructor(in_x_scale, in_y_scale, x_range, y_range, extra_x_ranges = {}, extra_y_ranges = {}) {
        super();
        this.in_x_scale = in_x_scale;
        this.in_y_scale = in_y_scale;
        this.x_range = x_range;
        this.y_range = y_range;
        this.extra_x_ranges = extra_x_ranges;
        this.extra_y_ranges = extra_y_ranges;
        assert(in_x_scale.source_range == null && in_x_scale.target_range == null);
        assert(in_y_scale.source_range == null && in_y_scale.target_range == null);
        this._configure_scales();
    }
    _get_ranges(range, extra_ranges) {
        return new Map(entries(Object.assign(Object.assign({}, extra_ranges), { default: range })));
    }
    /*protected*/ _get_scales(scale, ranges, frame_range) {
        const scales = new Map();
        for (const [name, range] of ranges) {
            if (range instanceof DataRange1d || range instanceof Range1d) {
                if (!(scale instanceof ContinuousScale))
                    throw new Error(`Range ${range.type} is incompatible is Scale ${scale.type}`);
            }
            if (range instanceof FactorRange) {
                if (!(scale instanceof CategoricalScale))
                    throw new Error(`Range ${range.type} is incompatible is Scale ${scale.type}`);
            }
            if (scale instanceof LogScale && range instanceof DataRange1d)
                range.scale_hint = "log";
            const derived_scale = scale.clone();
            derived_scale.setv({ source_range: range, target_range: frame_range });
            scales.set(name, derived_scale);
        }
        return scales;
    }
    _configure_frame_ranges() {
        // data to/from screen space transform (left-bottom <-> left-top origin)
        const { bbox } = this;
        this._x_target = new Range1d({ start: bbox.left, end: bbox.right });
        this._y_target = new Range1d({ start: bbox.bottom, end: bbox.top });
    }
    _configure_scales() {
        this._configure_frame_ranges();
        this._x_ranges = this._get_ranges(this.x_range, this.extra_x_ranges);
        this._y_ranges = this._get_ranges(this.y_range, this.extra_y_ranges);
        this._x_scales = this._get_scales(this.in_x_scale, this._x_ranges, this._x_target);
        this._y_scales = this._get_scales(this.in_y_scale, this._y_ranges, this._y_target);
    }
    _update_scales() {
        this._configure_frame_ranges();
        for (const [, scale] of this._x_scales) {
            scale.target_range = this._x_target;
        }
        for (const [, scale] of this._y_scales) {
            scale.target_range = this._y_target;
        }
    }
    _set_geometry(outer, inner) {
        super._set_geometry(outer, inner);
        this._update_scales();
    }
    get x_ranges() {
        return this._x_ranges;
    }
    get y_ranges() {
        return this._y_ranges;
    }
    get x_scales() {
        return this._x_scales;
    }
    get y_scales() {
        return this._y_scales;
    }
    get x_scale() {
        return this._x_scales.get("default");
    }
    get y_scale() {
        return this._y_scales.get("default");
    }
    /** @deprecated */
    get xscales() {
        return to_object(this.x_scales);
    }
    /** @deprecated */
    get yscales() {
        return to_object(this.y_scales);
    }
}
CartesianFrame.__name__ = "CartesianFrame";
//# sourceMappingURL=cartesian_frame.js.map