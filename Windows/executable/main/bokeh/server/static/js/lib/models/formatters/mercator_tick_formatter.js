import { BasicTickFormatter } from "./basic_tick_formatter";
import * as p from "../../core/properties";
import { wgs84_mercator } from "../../core/util/projections";
export class MercatorTickFormatter extends BasicTickFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_MercatorTickFormatter() {
        this.define({
            dimension: [p.LatLon],
        });
    }
    doFormat(ticks, opts) {
        if (this.dimension == null)
            throw new Error("MercatorTickFormatter.dimension not configured");
        if (ticks.length == 0)
            return [];
        const n = ticks.length;
        const proj_ticks = new Array(n);
        if (this.dimension == "lon") {
            for (let i = 0; i < n; i++) {
                const [lon] = wgs84_mercator.invert(ticks[i], opts.loc);
                proj_ticks[i] = lon;
            }
        }
        else {
            for (let i = 0; i < n; i++) {
                const [, lat] = wgs84_mercator.invert(opts.loc, ticks[i]);
                proj_ticks[i] = lat;
            }
        }
        return super.doFormat(proj_ticks, opts);
    }
}
MercatorTickFormatter.__name__ = "MercatorTickFormatter";
MercatorTickFormatter.init_MercatorTickFormatter();
//# sourceMappingURL=mercator_tick_formatter.js.map