import { ContinuousColorMapper } from "./continuous_color_mapper";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare type LogScanData = {
    min: number;
    max: number;
    scale: number;
};
export declare namespace LogColorMapper {
    type Attrs = p.AttrsOf<Props>;
    type Props = ContinuousColorMapper.Props;
}
export interface LogColorMapper extends LogColorMapper.Attrs {
}
export declare class LogColorMapper extends ContinuousColorMapper {
    properties: LogColorMapper.Props;
    constructor(attrs?: Partial<LogColorMapper.Attrs>);
    protected scan(data: Arrayable<number>, n: number): LogScanData;
    protected cmap<T>(d: number, palette: Arrayable<T>, low_color: T, high_color: T, scan_data: LogScanData): T;
}
