import { SizeHint, Size } from "./types";
import { Layoutable } from "./layoutable";
import { Align } from "../enums";
import { BBox } from "../util/bbox";
export declare type GridItem = {
    layout: Layoutable;
    row: number;
    col: number;
    row_span?: number;
    col_span?: number;
};
export declare type ItemSizeHint = {
    layout: Layoutable;
    size_hint: SizeHint;
};
export declare type GridSizeHint = {
    size: Size;
    size_hints: Container<ItemSizeHint>;
    row_heights: number[];
    col_widths: number[];
};
declare type TrackAlign = "auto" | Align;
export declare type QuickTrackSizing = "auto" | "min" | "fit" | "max" | number;
export declare type RowSizing = {
    policy: "auto" | "min";
    align?: TrackAlign;
} | {
    policy: "fit" | "max";
    flex?: number;
    align?: TrackAlign;
} | {
    policy: "fixed";
    height: number;
    align?: TrackAlign;
};
export declare type ColSizing = {
    policy: "auto" | "min";
    align?: TrackAlign;
} | {
    policy: "fit" | "max";
    flex?: number;
    align?: TrackAlign;
} | {
    policy: "fixed";
    width: number;
    align?: TrackAlign;
};
export declare type RowsSizing = QuickTrackSizing | {
    [key: string]: QuickTrackSizing | RowSizing;
};
export declare type ColsSizing = QuickTrackSizing | {
    [key: string]: QuickTrackSizing | ColSizing;
};
declare type Span = {
    r0: number;
    c0: number;
    r1: number;
    c1: number;
};
declare class Container<T> {
    private readonly _items;
    private _nrows;
    private _ncols;
    get nrows(): number;
    get ncols(): number;
    add(span: Span, data: T): void;
    at(r: number, c: number): T[];
    row(r: number): T[];
    col(c: number): T[];
    foreach(fn: (span: Span, data: T) => void): void;
    map<U>(fn: (span: Span, data: T) => U): Container<U>;
}
export declare class Grid extends Layoutable {
    items: GridItem[];
    rows: RowsSizing;
    cols: ColsSizing;
    spacing: number | [number, number];
    absolute: boolean;
    private _state;
    constructor(items?: GridItem[]);
    is_width_expanding(): boolean;
    is_height_expanding(): boolean;
    protected _init(): void;
    protected _measure_totals(row_heights: number[], col_widths: number[]): Size;
    protected _measure_cells(cell_viewport: (r: number, c: number) => Size): GridSizeHint;
    protected _measure_grid(viewport: Size): GridSizeHint;
    protected _measure(viewport: Size): SizeHint;
    protected _set_geometry(outer: BBox, inner: BBox): void;
}
export declare class Row extends Grid {
    constructor(items: Layoutable[]);
}
export declare class Column extends Grid {
    constructor(items: Layoutable[]);
}
export {};
