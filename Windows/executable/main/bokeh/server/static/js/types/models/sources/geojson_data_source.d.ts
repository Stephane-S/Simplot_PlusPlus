import { ColumnarDataSource } from "./columnar_data_source";
import * as p from "../../core/properties";
import { Arrayable } from "../../core/types";
export declare type GeoData = {
    x: Arrayable<number>;
    y: Arrayable<number>;
    z: Arrayable<number>;
    xs: Arrayable<Arrayable<number>>;
    ys: Arrayable<Arrayable<number>>;
    zs: Arrayable<Arrayable<number>>;
    [key: string]: Arrayable;
};
export declare namespace GeoJSONDataSource {
    type Attrs = p.AttrsOf<Props>;
    type Props = ColumnarDataSource.Props & {
        geojson: p.Property<string>;
    };
}
export interface GeoJSONDataSource extends GeoJSONDataSource.Attrs {
}
export declare class GeoJSONDataSource extends ColumnarDataSource {
    properties: GeoJSONDataSource.Props;
    constructor(attrs?: Partial<GeoJSONDataSource.Attrs>);
    static init_GeoJSONDataSource(): void;
    initialize(): void;
    connect_signals(): void;
    protected _update_data(): void;
    protected _get_new_list_array(length: number): number[][];
    protected _get_new_nan_array(length: number): number[];
    private _add_properties;
    private _add_geometry;
    geojson_to_column_data(): GeoData;
}
