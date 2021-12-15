import { Indices, Rect } from "../types";
export declare class SpatialIndex {
    private readonly index;
    constructor(size: number);
    add(x0: number, y0: number, x1: number, y1: number): void;
    add_empty(): void;
    finish(): void;
    protected _normalize(rect: Rect): Rect;
    get bbox(): Rect;
    indices(rect: Rect): Indices;
    bounds(rect: Rect): Rect;
}
