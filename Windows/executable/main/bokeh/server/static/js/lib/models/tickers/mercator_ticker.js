import { BasicTicker } from "./basic_ticker";
import * as p from "../../core/properties";
import { wgs84_mercator, clip_mercator, in_bounds } from "../../core/util/projections";
export class MercatorTicker extends BasicTicker {
    constructor(attrs) {
        super(attrs);
    }
    static init_MercatorTicker() {
        this.define({
            dimension: [p.LatLon],
        });
    }
    get_ticks_no_defaults(data_low, data_high, cross_loc, desired_n_ticks) {
        if (this.dimension == null) {
            throw new Error(`${this}.dimension wasn't configured`);
        }
        [data_low, data_high] = clip_mercator(data_low, data_high, this.dimension);
        if (this.dimension == "lon")
            return this._get_ticks_lon(data_low, data_high, cross_loc, desired_n_ticks);
        else
            return this._get_ticks_lat(data_low, data_high, cross_loc, desired_n_ticks);
    }
    _get_ticks_lon(data_low, data_high, cross_loc, desired_n_ticks) {
        const [proj_low] = wgs84_mercator.invert(data_low, cross_loc);
        const [proj_high, proj_cross_loc] = wgs84_mercator.invert(data_high, cross_loc);
        const proj_ticks = super.get_ticks_no_defaults(proj_low, proj_high, cross_loc, desired_n_ticks);
        const major = [];
        for (const tick of proj_ticks.major) {
            if (in_bounds(tick, "lon")) {
                const [lon] = wgs84_mercator.compute(tick, proj_cross_loc);
                major.push(lon);
            }
        }
        const minor = [];
        for (const tick of proj_ticks.minor) {
            if (in_bounds(tick, "lon")) {
                const [lon] = wgs84_mercator.compute(tick, proj_cross_loc);
                minor.push(lon);
            }
        }
        return { major, minor };
    }
    _get_ticks_lat(data_low, data_high, cross_loc, desired_n_ticks) {
        const [, proj_low] = wgs84_mercator.invert(cross_loc, data_low);
        const [proj_cross_loc, proj_high] = wgs84_mercator.invert(cross_loc, data_high);
        const proj_ticks = super.get_ticks_no_defaults(proj_low, proj_high, cross_loc, desired_n_ticks);
        const major = [];
        for (const tick of proj_ticks.major) {
            if (in_bounds(tick, "lat")) {
                const [, lat] = wgs84_mercator.compute(proj_cross_loc, tick);
                major.push(lat);
            }
        }
        const minor = [];
        for (const tick of proj_ticks.minor) {
            if (in_bounds(tick, "lat")) {
                const [, lat] = wgs84_mercator.compute(proj_cross_loc, tick);
                minor.push(lat);
            }
        }
        return { major, minor };
    }
}
MercatorTicker.__name__ = "MercatorTicker";
MercatorTicker.init_MercatorTicker();
//# sourceMappingURL=mercator_ticker.js.map