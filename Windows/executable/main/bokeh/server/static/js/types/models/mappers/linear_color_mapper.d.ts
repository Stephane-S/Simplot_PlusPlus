import { ContinuousColorMapper } from "./continuous_color_mapper";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace LinearColorMapper {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousColorMapper.Props;
}
export declare type LinearScanData = {
    min: number;
    max: number;
    norm_factor: number;
    normed_interval: number;
};
export interface LinearColorMapper extends LinearColorMapper.Attrs {
}
export declare class LinearColorMapper extends ContinuousColorMapper {
    properties: LinearColorMapper.Props;
    constructor(attrs?: Partial<LinearColorMapper.Attrs>);
    protected scan(data: Arrayable<number>, n: number): LinearScanData;
    protected cmap<T>(d: number, palette: Arrayable<T>, low_color: T, high_color: T, scan_data: LinearScanData): T;
}
