import { Plot } from "./plot";
import * as p from "../../core/properties";
import { Model } from "../../model";
import { GMapPlotView } from "./gmap_plot_canvas";
export { GMapPlotView };
export declare namespace MapOptions {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        lat: p.Property<number>;
        lng: p.Property<number>;
        zoom: p.Property<number>;
    };
}
export interface MapOptions extends MapOptions.Attrs {
}
export declare class MapOptions extends Model {
    properties: MapOptions.Props;
    constructor(attrs?: Partial<MapOptions.Attrs>);
    static init_MapOptions(): void;
}
export declare namespace GMapOptions {
    type Attrs = p.AttrsOf<Props>;
    type Props = MapOptions.Props & {
        map_type: p.Property<string>;
        scale_control: p.Property<boolean>;
        styles: p.Property<string>;
        tilt: p.Property<number>;
    };
}
export interface GMapOptions extends GMapOptions.Attrs {
}
export declare class GMapOptions extends MapOptions {
    properties: GMapOptions.Props;
    constructor(attrs?: Partial<GMapOptions.Attrs>);
    static init_GMapOptions(): void;
}
export declare namespace GMapPlot {
    type Attrs = p.AttrsOf<Props>;
    type Props = Plot.Props & {
        map_options: p.Property<GMapOptions>;
        api_key: p.Property<string>;
    };
}
export interface GMapPlot extends GMapPlot.Attrs {
}
export declare class GMapPlot extends Plot {
    properties: GMapPlot.Props;
    width: number | null;
    height: number | null;
    constructor(attrs?: Partial<GMapPlot.Attrs>);
    static init_GMapPlot(): void;
    initialize(): void;
}
