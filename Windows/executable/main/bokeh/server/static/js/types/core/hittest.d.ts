import { Arrayable } from "./types";
import { Selection } from "../models/selections/selection";
export declare type HitTestResult = Selection | null;
export declare function point_in_poly(x: number, y: number, px: Arrayable<number>, py: Arrayable<number>): boolean;
export declare function point_in_ellipse(x: number, y: number, angle: number, b: number, a: number, x0: number, y0: number): boolean;
export declare type Point = {
    x: number;
    y: number;
};
export declare function dist_2_pts(p0: Point, p1: Point): number;
export declare function dist_to_segment_squared(p: Point, v: Point, w: Point): number;
export declare function dist_to_segment(p: Point, v: Point, w: Point): number;
export declare function check_2_segments_intersect(l0_x0: number, l0_y0: number, l0_x1: number, l0_y1: number, l1_x0: number, l1_y0: number, l1_x1: number, l1_y1: number): {
    hit: boolean;
    x: number | null;
    y: number | null;
};
