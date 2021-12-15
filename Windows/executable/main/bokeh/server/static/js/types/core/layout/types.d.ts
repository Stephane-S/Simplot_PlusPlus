import { Align } from "../enums";
import { Size, Extents } from "../types";
export { Size };
export declare class Sizeable implements Size {
    width: number;
    height: number;
    constructor(size?: Partial<Size>);
    bounded_to({ width, height }: Partial<Size>): Sizeable;
    expanded_to({ width, height }: Size): Sizeable;
    expand_to({ width, height }: Size): void;
    narrowed_to({ width, height }: Size): Sizeable;
    narrow_to({ width, height }: Size): void;
    grow_by({ left, right, top, bottom }: Extents): Sizeable;
    shrink_by({ left, right, top, bottom }: Extents): Sizeable;
    map(w_fn: (v: number) => number, h_fn?: (v: number) => number): Sizeable;
}
export declare type Margin = Extents;
export declare type SizeHint = Size & {
    inner?: Margin;
    align?: boolean;
};
export declare type SizingPolicy = "fixed" | "fit" | "min" | "max";
export declare const SizingPolicy: import("../kinds").Kinds.Enum<SizingPolicy>;
export declare type Sizing = number | "fit" | "min" | "max";
export declare type BoxSizing = {
    width_policy: SizingPolicy;
    min_width: number;
    width?: number;
    max_width: number;
    height_policy: SizingPolicy;
    min_height: number;
    height?: number;
    max_height: number;
    aspect?: number;
    margin: Margin;
    visible: boolean;
    halign: Align;
    valign: Align;
};
