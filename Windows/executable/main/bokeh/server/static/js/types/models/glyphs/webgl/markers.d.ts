import { Program, VertexBuffer, IndexBuffer } from "./utils";
import { BaseGLGlyph, Transform } from "./base";
import { MarkerView } from "../../markers/marker";
import { CircleView } from "../circle";
import { Class } from "../../../core/class";
export declare function attach_float(prog: Program, vbo: VertexBuffer & {
    used?: boolean;
}, att_name: string, n: number, visual: any, name: string): void;
export declare function attach_color(prog: Program, vbo: VertexBuffer & {
    used?: boolean;
}, att_name: string, n: number, visual: any, prefix: string): void;
export declare abstract class MarkerGL extends BaseGLGlyph {
    readonly glyph: MarkerView | CircleView;
    protected abstract get _marker_code(): string;
    protected prog: Program;
    protected vbo_sx: VertexBuffer;
    protected vbo_sy: VertexBuffer;
    protected vbo_s: VertexBuffer;
    protected vbo_a: VertexBuffer;
    protected vbo_linewidth: VertexBuffer & {
        used?: boolean;
    };
    protected vbo_fg_color: VertexBuffer & {
        used?: boolean;
    };
    protected vbo_bg_color: VertexBuffer & {
        used?: boolean;
    };
    protected index_buffer: IndexBuffer;
    protected last_trans: Transform;
    protected _baked_offset: [number, number];
    protected init(): void;
    draw(indices: number[], mainGlyph: MarkerView | CircleView, trans: Transform): void;
    protected _set_data(nvertices: number): void;
    protected _set_visuals(nvertices: number): void;
}
export declare const AsteriskGL: Class<MarkerGL, any[]>;
export declare const CircleGL: Class<MarkerGL, any[]>;
export declare const CircleCrossGL: Class<MarkerGL, any[]>;
export declare const CircleXGL: Class<MarkerGL, any[]>;
export declare const CrossGL: Class<MarkerGL, any[]>;
export declare const DiamondGL: Class<MarkerGL, any[]>;
export declare const DiamondCrossGL: Class<MarkerGL, any[]>;
export declare const HexGL: Class<MarkerGL, any[]>;
export declare const InvertedTriangleGL: Class<MarkerGL, any[]>;
export declare const SquareGL: Class<MarkerGL, any[]>;
export declare const SquareCrossGL: Class<MarkerGL, any[]>;
export declare const SquareXGL: Class<MarkerGL, any[]>;
export declare const TriangleGL: Class<MarkerGL, any[]>;
export declare const XGL: Class<MarkerGL, any[]>;
