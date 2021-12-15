import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { SpatialUnits, RenderMode, Dimension } from "../../core/enums";
import * as p from "../../core/properties";
export declare class SpanView extends AnnotationView {
    model: Span;
    visuals: Span.Visuals;
    connect_signals(): void;
    protected _render(): void;
}
export declare namespace Span {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        render_mode: p.Property<RenderMode>;
        location: p.Property<number | null>;
        location_units: p.Property<SpatialUnits>;
        dimension: p.Property<Dimension>;
        for_hover: p.Property<boolean>;
    } & Mixins;
    type Mixins = mixins.Line;
    type Visuals = Annotation.Visuals & {
        line: Line;
    };
}
export interface Span extends Span.Attrs {
}
export declare class Span extends Annotation {
    properties: Span.Props;
    __view_type__: SpanView;
    constructor(attrs?: Partial<Span.Attrs>);
    static init_Span(): void;
}
