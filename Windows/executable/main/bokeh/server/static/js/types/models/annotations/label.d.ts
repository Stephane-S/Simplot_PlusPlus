import { TextAnnotation, TextAnnotationView } from "./text_annotation";
import { SpatialUnits, AngleUnits } from "../../core/enums";
import { Size } from "../../core/layout";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
export declare class LabelView extends TextAnnotationView {
    model: Label;
    visuals: Label.Visuals;
    initialize(): void;
    protected _get_size(): Size;
    protected _render(): void;
}
export declare namespace Label {
    type Props = TextAnnotation.Props & {
        x: p.Property<number>;
        x_units: p.Property<SpatialUnits>;
        y: p.Property<number>;
        y_units: p.Property<SpatialUnits>;
        text: p.Property<string>;
        angle: p.Property<number>;
        angle_units: p.Property<AngleUnits>;
        x_offset: p.Property<number>;
        y_offset: p.Property<number>;
    } & Mixins;
    type Attrs = p.AttrsOf<Props>;
    type Mixins = mixins.Text & mixins.BorderLine & mixins.BackgroundFill;
    type Visuals = TextAnnotation.Visuals;
}
export interface Label extends Label.Attrs {
}
export declare class Label extends TextAnnotation {
    properties: Label.Props;
    __view_type__: LabelView;
    constructor(attrs?: Partial<Label.Attrs>);
    static init_Label(): void;
}
