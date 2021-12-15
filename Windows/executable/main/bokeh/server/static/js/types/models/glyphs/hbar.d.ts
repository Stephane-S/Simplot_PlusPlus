import { Box, BoxView, BoxData } from "./box";
import { NumberArray } from "../../core/types";
import * as p from "../../core/properties";
export interface HBarData extends BoxData {
    _left: NumberArray;
    _y: NumberArray;
    _height: NumberArray;
    _right: NumberArray;
    sy: NumberArray;
    sh: NumberArray;
    sleft: NumberArray;
    sright: NumberArray;
    stop: NumberArray;
    sbottom: NumberArray;
    max_height: number;
}
export interface HBarView extends HBarData {
}
export declare class HBarView extends BoxView {
    model: HBar;
    visuals: HBar.Visuals;
    scenterxy(i: number): [number, number];
    protected _lrtb(i: number): [number, number, number, number];
    protected _map_data(): void;
}
export declare namespace HBar {
    type Attrs = p.AttrsOf<Props>;
    type Props = Box.Props & {
        left: p.CoordinateSpec;
        y: p.CoordinateSpec;
        height: p.NumberSpec;
        right: p.CoordinateSpec;
    };
    type Visuals = Box.Visuals;
}
export interface HBar extends HBar.Attrs {
}
export declare class HBar extends Box {
    properties: HBar.Props;
    __view_type__: HBarView;
    constructor(attrs?: Partial<HBar.Attrs>);
    static init_HBar(): void;
}
