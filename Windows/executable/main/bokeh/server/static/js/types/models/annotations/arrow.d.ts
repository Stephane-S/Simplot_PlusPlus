import { Annotation, AnnotationView } from "./annotation";
import { ArrowHead } from "./arrow_head";
import { ColumnarDataSource } from "../sources/columnar_data_source";
import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { SpatialUnits } from "../../core/enums";
import { Arrayable } from "../../core/types";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare type Coords = [Arrayable<number>, Arrayable<number>];
export declare class ArrowView extends AnnotationView {
    model: Arrow;
    visuals: Arrow.Visuals;
    protected _x_start: Arrayable<number>;
    protected _y_start: Arrayable<number>;
    protected _x_end: Arrayable<number>;
    protected _y_end: Arrayable<number>;
    initialize(): void;
    connect_signals(): void;
    set_data(source: ColumnarDataSource): void;
    protected _map_data(): [Coords, Coords];
    protected _render(): void;
    protected _arrow_head(ctx: Context2d, action: "render" | "clip", head: ArrowHead, start: Coords, end: Coords): void;
    protected _arrow_body(ctx: Context2d, start: Coords, end: Coords): void;
}
export declare namespace Arrow {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        x_start: p.NumberSpec;
        y_start: p.NumberSpec;
        start_units: p.Property<SpatialUnits>;
        start: p.Property<ArrowHead | null>;
        x_end: p.NumberSpec;
        y_end: p.NumberSpec;
        end_units: p.Property<SpatialUnits>;
        end: p.Property<ArrowHead | null>;
        source: p.Property<ColumnarDataSource>;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = Annotation.Visuals & {
        line: Line;
    };
}
export interface Arrow extends Arrow.Attrs {
}
export declare class Arrow extends Annotation {
    properties: Arrow.Props;
    __view_type__: ArrowView;
    constructor(attrs?: Partial<Arrow.Attrs>);
    static init_Arrow(): void;
}
