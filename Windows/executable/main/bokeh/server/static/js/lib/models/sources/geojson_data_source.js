import { ColumnarDataSource } from "./columnar_data_source";
import { logger } from "../../core/logging";
import * as p from "../../core/properties";
import { range } from "../../core/util/array";
import { entries } from "../../core/util/object";
function orNaN(v) {
    return v != null ? v : NaN;
}
export class GeoJSONDataSource extends ColumnarDataSource {
    constructor(attrs) {
        super(attrs);
    }
    static init_GeoJSONDataSource() {
        this.define({
            geojson: [p.Any],
        });
        this.internal({
            data: [p.Any, {}],
        });
    }
    initialize() {
        super.initialize();
        this._update_data();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.properties.geojson.change, () => this._update_data());
    }
    _update_data() {
        this.data = this.geojson_to_column_data();
    }
    _get_new_list_array(length) {
        return range(0, length).map((_i) => []);
    }
    _get_new_nan_array(length) {
        return range(0, length).map((_i) => NaN);
    }
    _add_properties(item, data, i, item_count) {
        var _a;
        const properties = (_a = item.properties) !== null && _a !== void 0 ? _a : {};
        for (const [property, value] of entries(properties)) {
            if (!data.hasOwnProperty(property))
                data[property] = this._get_new_nan_array(item_count);
            // orNaN necessary here to prevent null values from ending up in the column
            data[property][i] = orNaN(value);
        }
    }
    _add_geometry(geometry, data, i) {
        function flatten(acc, item) {
            return acc.concat([[NaN, NaN, NaN]]).concat(item);
        }
        switch (geometry.type) {
            case "Point": {
                const [x, y, z] = geometry.coordinates;
                data.x[i] = x;
                data.y[i] = y;
                data.z[i] = orNaN(z);
                break;
            }
            case "LineString": {
                const { coordinates } = geometry;
                for (let j = 0; j < coordinates.length; j++) {
                    const [x, y, z] = coordinates[j];
                    data.xs[i][j] = x;
                    data.ys[i][j] = y;
                    data.zs[i][j] = orNaN(z);
                }
                break;
            }
            case "Polygon": {
                if (geometry.coordinates.length > 1)
                    logger.warn('Bokeh does not support Polygons with holes in, only exterior ring used.');
                const exterior_ring = geometry.coordinates[0];
                for (let j = 0; j < exterior_ring.length; j++) {
                    const [x, y, z] = exterior_ring[j];
                    data.xs[i][j] = x;
                    data.ys[i][j] = y;
                    data.zs[i][j] = orNaN(z);
                }
                break;
            }
            case "MultiPoint": {
                logger.warn('MultiPoint not supported in Bokeh');
                break;
            }
            case "MultiLineString": {
                const coordinates = geometry.coordinates.reduce(flatten);
                for (let j = 0; j < coordinates.length; j++) {
                    const [x, y, z] = coordinates[j];
                    data.xs[i][j] = x;
                    data.ys[i][j] = y;
                    data.zs[i][j] = orNaN(z);
                }
                break;
            }
            case "MultiPolygon": {
                const exterior_rings = [];
                for (const polygon of geometry.coordinates) {
                    if (polygon.length > 1)
                        logger.warn('Bokeh does not support Polygons with holes in, only exterior ring used.');
                    exterior_rings.push(polygon[0]);
                }
                const coordinates = exterior_rings.reduce(flatten);
                for (let j = 0; j < coordinates.length; j++) {
                    const [x, y, z] = coordinates[j];
                    data.xs[i][j] = x;
                    data.ys[i][j] = y;
                    data.zs[i][j] = orNaN(z);
                }
                break;
            }
            default:
                throw new Error(`Invalid GeoJSON geometry type: ${geometry.type}`);
        }
    }
    geojson_to_column_data() {
        const geojson = JSON.parse(this.geojson);
        let items;
        switch (geojson.type) {
            case "GeometryCollection": {
                if (geojson.geometries == null)
                    throw new Error('No geometries found in GeometryCollection');
                if (geojson.geometries.length === 0)
                    throw new Error('geojson.geometries must have one or more items');
                items = geojson.geometries;
                break;
            }
            case "FeatureCollection": {
                if (geojson.features == null)
                    throw new Error('No features found in FeaturesCollection');
                if (geojson.features.length == 0)
                    throw new Error('geojson.features must have one or more items');
                items = geojson.features;
                break;
            }
            default:
                throw new Error('Bokeh only supports type GeometryCollection and FeatureCollection at top level');
        }
        let item_count = 0;
        for (const item of items) {
            const geometry = item.type === 'Feature' ? item.geometry : item;
            if (geometry.type == 'GeometryCollection')
                item_count += geometry.geometries.length;
            else
                item_count += 1;
        }
        const data = {
            x: this._get_new_nan_array(item_count),
            y: this._get_new_nan_array(item_count),
            z: this._get_new_nan_array(item_count),
            xs: this._get_new_list_array(item_count),
            ys: this._get_new_list_array(item_count),
            zs: this._get_new_list_array(item_count),
        };
        let arr_index = 0;
        for (const item of items) {
            const geometry = item.type == 'Feature' ? item.geometry : item;
            if (geometry.type == "GeometryCollection") {
                for (const g of geometry.geometries) {
                    this._add_geometry(g, data, arr_index);
                    if (item.type === 'Feature')
                        this._add_properties(item, data, arr_index, item_count);
                    arr_index += 1;
                }
            }
            else {
                this._add_geometry(geometry, data, arr_index);
                if (item.type === 'Feature')
                    this._add_properties(item, data, arr_index, item_count);
                arr_index += 1;
            }
        }
        return data;
    }
}
GeoJSONDataSource.__name__ = "GeoJSONDataSource";
GeoJSONDataSource.init_GeoJSONDataSource();
//# sourceMappingURL=geojson_data_source.js.map