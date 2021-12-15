import { UpperLower, UpperLowerView } from "./upper_lower";
import { ArrowHead } from "./arrow_head";
import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import * as p from "../../core/properties";
export declare class WhiskerView extends UpperLowerView {
    model: Whisker;
    visuals: Whisker.Visuals;
    connect_signals(): void;
    protected _render(): void;
}
export declare namespace Whisker {
    type Attrs = p.AttrsOf<Props>;
    type Props = UpperLower.Props & {
        lower_head: p.Property<ArrowHead>;
        upper_head: p.Property<ArrowHead>;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = UpperLower.Visuals & {
        line: Line;
    };
}
export interface Whisker extends Whisker.Attrs {
}
export declare class Whisker extends UpperLower {
    properties: Whisker.Props;
    __view_type__: WhiskerView;
    constructor(attrs?: Partial<Whisker.Attrs>);
    static init_Whisker(): void;
}
