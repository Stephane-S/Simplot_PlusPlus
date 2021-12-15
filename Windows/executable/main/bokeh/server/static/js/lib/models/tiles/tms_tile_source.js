import { MercatorTileSource } from './mercator_tile_source';
export class TMSTileSource extends MercatorTileSource {
    constructor(attrs) {
        super(attrs);
    }
    get_image_url(x, y, z) {
        const image_url = this.string_lookup_replace(this.url, this.extra_url_vars);
        return image_url
            .replace("{X}", x.toString())
            .replace('{Y}', y.toString())
            .replace("{Z}", z.toString());
    }
}
TMSTileSource.__name__ = "TMSTileSource";
//# sourceMappingURL=tms_tile_source.js.map