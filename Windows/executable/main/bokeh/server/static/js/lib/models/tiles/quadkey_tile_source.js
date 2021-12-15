import { MercatorTileSource } from './mercator_tile_source';
export class QUADKEYTileSource extends MercatorTileSource {
    constructor(attrs) {
        super(attrs);
    }
    get_image_url(x, y, z) {
        const image_url = this.string_lookup_replace(this.url, this.extra_url_vars);
        const [wx, wy, wz] = this.tms_to_wmts(x, y, z);
        const quadKey = this.tile_xyz_to_quadkey(wx, wy, wz);
        return image_url.replace("{Q}", quadKey);
    }
}
QUADKEYTileSource.__name__ = "QUADKEYTileSource";
//# sourceMappingURL=quadkey_tile_source.js.map