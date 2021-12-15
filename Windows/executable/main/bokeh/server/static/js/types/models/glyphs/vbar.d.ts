import { Box, BoxView, BoxData } from "./box";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export interface VBarData extends BoxData {
    _x: NumberArray;
    _bottom: NumberArray;
    _width: NumberArray;
    _top: NumberArray;
    sx: NumberArray;
    sw: NumberArray;
    stop: NumberArray;
    sbottom: NumberArray;
    sleft: NumberArray;
    sright: NumberArray;
    max_width: number;
}
export interface VBarView extends VBarData {
}
export declare class VBarView extends BoxView {
    model: VBar;
    visuals: VBar.Visuals;
    scenterxy(i: number): [number, number];
    protected _lrtb(i: number): [number, number, number, number];
    protected _map_data(): void;
}
export declare namespace VBar {
    type Attrs = p.AttrsOf<Props>;
    type Props = Box.Props & {
        x: p.CoordinateSpec;
        bottom: p.CoordinateSpec;
        width: p.NumberSpec;
        top: p.CoordinateSpec;
    };
    type Visuals = Box.Visuals;
}
export interface VBar extends VBar.Attrs {
}
export declare class VBar extends Box {
    properties: VBar.Props;
    __view_type__: VBarView;
    constructor(attrs?: Partial<VBar.Attrs>);
    static init_VBar(): void;
}
