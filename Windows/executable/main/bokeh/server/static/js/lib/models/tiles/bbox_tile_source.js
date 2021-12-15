import { MercatorTileSource } from './mercator_tile_source';
import * as p from "../../core/properties";
export class BBoxTileSource extends MercatorTileSource {
    constructor(attrs) {
        super(attrs);
    }
    static init_BBoxTileSource() {
        this.define({
            use_latlon: [p.Boolean, false],
        });
    }
    get_image_url(x, y, z) {
        const image_url = this.string_lookup_replace(this.url, this.extra_url_vars);
        let xmax, xmin, ymax, ymin;
        if (this.use_latlon)
            [xmin, ymin, xmax, ymax] = this.get_tile_geographic_bounds(x, y, z);
        else
            [xmin, ymin, xmax, ymax] = this.get_tile_meter_bounds(x, y, z);
        return image_url
            .replace("{XMIN}", xmin.toString())
            .replace("{YMIN}", ymin.toString())
            .replace("{XMAX}", xmax.toString())
            .replace("{YMAX}", ymax.toString());
    }
}
BBoxTileSource.__name__ = "BBoxTileSource";
BBoxTileSource.init_BBoxTileSource();
//# sourceMappingURL=bbox_tile_source.js.map