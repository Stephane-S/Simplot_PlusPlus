import { Arrayable } from "../types";
export declare class AffineTransform {
    private a;
    private b;
    private c;
    private d;
    private e;
    private f;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    toString(): string;
    clone(): AffineTransform;
    get is_identity(): boolean;
    apply(x: number, y: number): [number, number];
    iv_apply(xs: Arrayable<number>, ys: Arrayable<number>): void;
    transform(A: number, B: number, C: number, D: number, E: number, F: number): this;
    translate(tx: number, ty: number): this;
    scale(cx: number, cy: number): this;
    skew(sx: number, sy: number): this;
    rotate(angle: number): this;
    rotate_ccw(angle: number): this;
    translate_x(tx: number): this;
    translate_y(ty: number): this;
    flip(): this;
    flip_x(): this;
    flip_y(): this;
}
