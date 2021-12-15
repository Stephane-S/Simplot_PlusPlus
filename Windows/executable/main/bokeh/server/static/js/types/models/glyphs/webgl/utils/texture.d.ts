import { TypedArray } from "../../../../core/util/ndarray";
export declare class Texture2d {
    readonly gl: WebGLRenderingContext;
    handle: WebGLTexture;
    _shape_format?: {
        width: number;
        height: number;
        format: number;
    };
    _target: number;
    _types: {
        [key: string]: number;
    };
    constructor(gl: WebGLRenderingContext);
    delete(): void;
    activate(): void;
    deactivate(): void;
    _get_alignment(width: number): number;
    set_wrapping(wrap_s: number, wrap_t: number): void;
    set_interpolation(min: number, mag: number): void;
    set_size([width, height]: [number, number], format: number): void;
    set_data(offset: [number, number], [width, height]: [number, number], data: TypedArray): void;
}
