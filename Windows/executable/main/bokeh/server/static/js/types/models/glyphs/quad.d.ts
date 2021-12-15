import { Box, BoxView, BoxData } from "./box";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export interface QuadData extends BoxData {
    _right: NumberArray;
    _bottom: NumberArray;
    _left: NumberArray;
    _top: NumberArray;
    sright: NumberArray;
    sbottom: NumberArray;
    sleft: NumberArray;
    stop: NumberArray;
}
export interface QuadView extends QuadData {
}
export declare class QuadView extends BoxView {
    model: Quad;
    visuals: Quad.Visuals;
    scenterxy(i: number): [number, number];
    protected _lrtb(i: number): [number, number, number, number];
}
export declare namespace Quad {
    type Attrs = p.AttrsOf<Props>;
    type Props = Box.Props & {
        right: p.CoordinateSpec;
        bottom: p.CoordinateSpec;
        left: p.CoordinateSpec;
        top: p.CoordinateSpec;
    };
    type Visuals = Box.Visuals;
}
export interface Quad extends Quad.Attrs {
}
export declare class Quad extends Box {
    properties: Quad.Props;
    __view_type__: QuadView;
    constructor(attrs?: Partial<Quad.Attrs>);
    static init_Quad(): void;
}
