import { MercatorTileSource } from './mercator_tile_source';
import * as p from "../../core/properties";
export declare namespace BBoxTileSource {
    type Attrs = p.AttrsOf<Props>;
    type Props = MercatorTileSource.Props & {
        use_latlon: p.Property<boolean>;
    };
}
export interface BBoxTileSource extends BBoxTileSource.Attrs {
}
export declare class BBoxTileSource extends MercatorTileSource {
    properties: BBoxTileSource.Props;
    constructor(attrs?: Partial<BBoxTileSource.Attrs>);
    static init_BBoxTileSource(): void;
    get_image_url(x: number, y: number, z: number): string;
}
