import { SizeHint, Size } from "./types";
import { Layoutable } from "./layoutable";
import { BBox } from "../util/bbox";
import { Anchor } from "../enums";
export declare abstract class Stack extends Layoutable {
    children: Layoutable[];
}
export declare class HStack extends Stack {
    protected _measure(_viewport: Size): SizeHint;
    protected _set_geometry(outer: BBox, inner: BBox): void;
}
export declare class VStack extends Stack {
    protected _measure(_viewport: Size): SizeHint;
    protected _set_geometry(outer: BBox, inner: BBox): void;
}
export declare type AnchorItem = {
    layout: Layoutable;
    anchor: Anchor;
    margin: number;
};
export declare class AnchorLayout extends Layoutable {
    children: AnchorItem[];
    protected _measure(viewport: Size): SizeHint;
    protected _set_geometry(outer: BBox, inner: BBox): void;
}
