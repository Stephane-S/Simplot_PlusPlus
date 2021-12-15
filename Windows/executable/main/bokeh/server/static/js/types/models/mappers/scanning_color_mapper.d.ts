import { ContinuousColorMapper } from "./continuous_color_mapper";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace ScanningColorMapper {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousColorMapper.Props;
}
export interface ScanningColorMapper extends ScanningColorMapper.Attrs {
}
export declare abstract class ScanningColorMapper extends ContinuousColorMapper {
    properties: ScanningColorMapper.Props;
    constructor(attrs?: Partial<ScanningColorMapper.Attrs>);
    metrics: {
        min: number;
        max: number;
        binning: Arrayable<number>;
    };
    protected cmap<T>(d: number, palette: Arrayable<T>, low_color: T, high_color: T, edges: any): T;
}
