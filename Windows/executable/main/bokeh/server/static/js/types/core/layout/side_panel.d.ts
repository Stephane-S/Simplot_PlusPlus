import { Size, Sizeable } from "./types";
import { ContentLayoutable } from "./layoutable";
import { Side } from "../enums";
export declare type Orient = "parallel" | "normal" | "horizontal" | "vertical";
export declare type TextOrient = "justified" | Orient;
export interface Panelable {
    get_size(): Size;
    rotate?: boolean;
}
export declare class SidePanel extends ContentLayoutable {
    readonly side: Side;
    readonly obj: Panelable;
    protected _dim: 0 | 1;
    protected _normals: [number, number];
    constructor(side: Side, obj: Panelable);
    protected _content_size(): Sizeable;
    get_oriented_size(): Size;
    has_size_changed(): boolean;
    get dimension(): 0 | 1;
    get normals(): [number, number];
    get is_horizontal(): boolean;
    get is_vertical(): boolean;
    apply_label_text_heuristics(ctx: CanvasRenderingContext2D, orient: TextOrient | number): void;
    get_label_angle_heuristic(orient: Orient): number;
}
