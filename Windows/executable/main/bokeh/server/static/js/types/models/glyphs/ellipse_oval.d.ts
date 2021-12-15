import { CenterRotatable, CenterRotatableView, CenterRotatableData } from "./center_rotatable";
import { PointGeometry } from "../../core/geometry";
import { LineVector, FillVector } from "../../core/property_mixins";
import { Rect } from "../../core/types";
import { Context2d } from "../../core/util/canvas";
import { Selection } from "../selections/selection";
import * as p from "../../core/properties";
export interface EllipseOvalData extends CenterRotatableData {
}
export interface EllipseOvalView extends EllipseOvalData {
}
export declare abstract class EllipseOvalView extends CenterRotatableView {
    model: EllipseOval;
    visuals: EllipseOval.Visuals;
    protected _set_data(): void;
    protected _map_data(): void;
    protected _render(ctx: Context2d, indices: number[], { sx, sy, sw, sh, _angle }: EllipseOvalData): void;
    protected _hit_point(geometry: PointGeometry): Selection;
    draw_legend_for_index(ctx: Context2d, { x0, y0, x1, y1 }: Rect, index: number): void;
    protected _bounds({ x0, x1, y0, y1 }: Rect): Rect;
}
export declare namespace EllipseOval {
    type Attrs = p.AttrsOf<Props>;
    type Props = CenterRotatable.Props & LineVector & FillVector;
    type Visuals = CenterRotatable.Visuals;
}
export interface EllipseOval extends EllipseOval.Attrs {
}
export declare abstract class EllipseOval extends CenterRotatable {
    properties: EllipseOval.Props;
    __view_type__: EllipseOvalView;
    constructor(attrs?: Partial<EllipseOval.Attrs>);
}
