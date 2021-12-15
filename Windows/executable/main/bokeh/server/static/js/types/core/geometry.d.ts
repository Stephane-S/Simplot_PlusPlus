import { Arrayable } from "./types";
export declare type PointGeometry = {
    type: "point";
    sx: number;
    sy: number;
};
export declare type SpanGeometry = {
    type: "span";
    direction: "h" | "v";
    sx: number;
    sy: number;
};
export declare type RectGeometry = {
    type: "rect";
    sx0: number;
    sx1: number;
    sy0: number;
    sy1: number;
};
export declare type PolyGeometry = {
    type: "poly";
    sx: Arrayable<number>;
    sy: Arrayable<number>;
};
export declare type Geometry = PointGeometry | SpanGeometry | RectGeometry | PolyGeometry;
export declare type PointGeometryData = PointGeometry & {
    x: number;
    y: number;
};
export declare type SpanGeometryData = SpanGeometry & {
    x: number;
    y: number;
};
export declare type RectGeometryData = RectGeometry & {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export declare type PolyGeometryData = PolyGeometry & {
    x: Arrayable<number>;
    y: Arrayable<number>;
};
export declare type GeometryData = PointGeometryData | SpanGeometryData | RectGeometryData | PolyGeometryData;
