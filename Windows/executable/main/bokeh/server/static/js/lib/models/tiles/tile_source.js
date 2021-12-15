import { Model } from "../../model";
import { entries } from "../../core/util/object";
import * as p from "../../core/properties";
export class TileSource extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_TileSource() {
        this.define({
            url: [p.String, ''],
            tile_size: [p.Number, 256],
            max_zoom: [p.Number, 30],
            min_zoom: [p.Number, 0],
            extra_url_vars: [p.Any, {}],
            attribution: [p.String, ''],
            x_origin_offset: [p.Number],
            y_origin_offset: [p.Number],
            initial_resolution: [p.Number],
        });
    }
    initialize() {
        super.initialize();
        this.tiles = new Map();
        this._normalize_case();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.change, () => this._clear_cache());
    }
    string_lookup_replace(str, lookup) {
        let result_str = str;
        for (const [key, value] of entries(lookup)) {
            result_str = result_str.replace(`{${key}}`, value);
        }
        return result_str;
    }
    _normalize_case() {
        /*
         * Note: should probably be refactored into subclasses.
         */
        const url = this.url
            .replace('{x}', '{X}')
            .replace('{y}', '{Y}')
            .replace('{z}', '{Z}')
            .replace('{q}', '{Q}')
            .replace('{xmin}', '{XMIN}')
            .replace('{ymin}', '{YMIN}')
            .replace('{xmax}', '{XMAX}')
            .replace('{ymax}', '{YMAX}');
        this.url = url;
    }
    _clear_cache() {
        this.tiles = new Map();
    }
    tile_xyz_to_key(x, y, z) {
        return `${x}:${y}:${z}`;
    }
    key_to_tile_xyz(key) {
        const [x, y, z] = key.split(':').map((c) => parseInt(c));
        return [x, y, z];
    }
    sort_tiles_from_center(tiles, tile_extent) {
        const [txmin, tymin, txmax, tymax] = tile_extent;
        const center_x = ((txmax - txmin) / 2) + txmin;
        const center_y = ((tymax - tymin) / 2) + tymin;
        tiles.sort(function (a, b) {
            const a_distance = Math.sqrt((center_x - a[0]) ** 2 + (center_y - a[1]) ** 2);
            const b_distance = Math.sqrt((center_x - b[0]) ** 2 + (center_y - b[1]) ** 2);
            return a_distance - b_distance;
        });
    }
    get_image_url(x, y, z) {
        const image_url = this.string_lookup_replace(this.url, this.extra_url_vars);
        return image_url
            .replace("{X}", x.toString())
            .replace('{Y}', y.toString())
            .replace("{Z}", z.toString());
    }
}
TileSource.__name__ = "TileSource";
TileSource.init_TileSource();
//# sourceMappingURL=tile_source.js.map