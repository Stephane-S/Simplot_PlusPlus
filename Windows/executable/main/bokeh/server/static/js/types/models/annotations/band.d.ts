import { UpperLower, UpperLowerView } from "./upper_lower";
import { ColumnarDataSource } from "../sources/columnar_data_source";
import * as mixins from "../../core/property_mixins";
import { Line, Fill } from "../../core/visuals";
import { Dimension } from "../../core/enums";
import * as p from "../../core/properties";
export declare class BandView extends UpperLowerView {
    model: Band;
    visuals: Band.Visuals;
    connect_signals(): void;
    protected _render(): void;
}
export declare namespace Band {
    type Attrs = p.AttrsOf<Props>;
    type Props = UpperLower.Props & {
        lower: p.DistanceSpec;
        upper: p.DistanceSpec;
        base: p.DistanceSpec;
        dimension: p.Property<Dimension>;
        source: p.Property<ColumnarDataSource>;
    } & Mixins;
    type Mixins = mixins.Line & mixins.Fill;
    type Visuals = UpperLower.Visuals & {
        line: Line;
        fill: Fill;
    };
}
export interface Band extends Band.Attrs {
}
export declare class Band extends UpperLower {
    properties: Band.Props;
    __view_type__: BandView;
    constructor(attrs?: Partial<Band.Attrs>);
    static init_Band(): void;
}
