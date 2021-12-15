import { ScanningColorMapper } from "./scanning_color_mapper";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
export declare namespace EqHistColorMapper {
    type Attrs = p.AttrsOf<Props>;
    type Props = ScanningColorMapper.Props & {
        bins: p.Property<number>;
    };
}
export interface EqHistColorMapper extends EqHistColorMapper.Attrs {
}
export declare class EqHistColorMapper extends ScanningColorMapper {
    properties: EqHistColorMapper.Props;
    constructor(attrs?: Partial<EqHistColorMapper.Attrs>);
    static init_EqHistColorMapper(): void;
    protected scan(data: Arrayable<number>, n: number): {
        min: number;
        max: number;
        binning: Arrayable<number>;
    };
}
