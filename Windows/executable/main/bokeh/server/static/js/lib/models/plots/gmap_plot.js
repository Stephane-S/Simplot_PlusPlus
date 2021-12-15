import { logger } from "../../core/logging";
import { Plot } from "./plot";
import * as p from "../../core/properties";
import { Model } from "../../model";
import { Range1d } from '../ranges/range1d';
import { GMapPlotView } from "./gmap_plot_canvas";
export { GMapPlotView };
export class MapOptions extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_MapOptions() {
        this.define({
            lat: [p.Number],
            lng: [p.Number],
            zoom: [p.Number, 12],
        });
    }
}
MapOptions.__name__ = "MapOptions";
MapOptions.init_MapOptions();
export class GMapOptions extends MapOptions {
    constructor(attrs) {
        super(attrs);
    }
    static init_GMapOptions() {
        this.define({
            map_type: [p.String, "roadmap"],
            scale_control: [p.Boolean, false],
            styles: [p.String],
            tilt: [p.Int, 45],
        });
    }
}
GMapOptions.__name__ = "GMapOptions";
GMapOptions.init_GMapOptions();
export class GMapPlot extends Plot {
    constructor(attrs) {
        super(attrs);
    }
    static init_GMapPlot() {
        this.prototype.default_view = GMapPlotView;
        // This seems to be necessary so that everything can initialize.
        // Feels very clumsy, but I'm not sure how the properties system wants
        // to handle something like this situation.
        this.define({
            map_options: [p.Instance],
            api_key: [p.String],
        });
        this.override({
            x_range: () => new Range1d(),
            y_range: () => new Range1d(),
        });
    }
    initialize() {
        super.initialize();
        this.use_map = true;
        if (!this.api_key)
            logger.error("api_key is required. See https://developers.google.com/maps/documentation/javascript/get-api-key for more information on how to obtain your own.");
    }
}
GMapPlot.__name__ = "GMapPlot";
GMapPlot.init_GMapPlot();
//# sourceMappingURL=gmap_plot.js.map