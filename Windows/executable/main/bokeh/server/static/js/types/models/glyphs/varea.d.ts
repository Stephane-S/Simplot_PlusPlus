import { PointGeometry } from "../../core/geometry";
import { Arrayable, NumberArray } from "../../core/types";
import { Area, AreaView, AreaData } from "./area";
import { Context2d } from "../../core/util/canvas";
import { SpatialIndex } from "../../core/util/spatial";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
export interface VAreaData extends AreaData {
    _x: NumberArray;
    _y1: NumberArray;
    _y2: NumberArray;
    sx: NumberArray;
    sy1: NumberArray;
    sy2: NumberArray;
}
export interface VAreaView extends VAreaData {
}
export declare class VAreaView extends AreaView {
    model: VArea;
    visuals: VArea.Visuals;
    protected _index_data(index: SpatialIndex): void;
    protected _inner(ctx: Context2d, sx: Arrayable<number>, sy1: Arrayable<number>, sy2: Arrayable<number>, func: (this: Context2d) => void): void;
    protected _render(ctx: Context2d, _indices: number[], { sx, sy1, sy2 }: VAreaData): void;
    scenterxy(i: number): [number, number];
    protected _hit_point(geometry: PointGeometry): Selection;
    protected _map_data(): void;
}
export declare namespace VArea {
    type Attrs = p.AttrsOf<Props>;
    type Props = Area.Props & {
        x: p.CoordinateSpec;
        y1: p.CoordinateSpec;
        y2: p.CoordinateSpec;
    };
    type Visuals = Area.Visuals;
}
export interface VArea extends VArea.Attrs {
}
export declare class VArea extends Area {
    properties: VArea.Props;
    __view_type__: VAreaView;
    constructor(attrs?: Partial<VArea.Attrs>);
    static init_VArea(): void;
}
