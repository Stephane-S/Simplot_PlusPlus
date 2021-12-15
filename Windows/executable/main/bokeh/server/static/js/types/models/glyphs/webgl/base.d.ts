import { Context2d } from "../../../core/util/canvas";
import { GlyphView } from "../glyph";
export declare abstract class BaseGLGlyph {
    readonly gl: WebGLRenderingContext;
    readonly glyph: GlyphView;
    protected nvertices: number;
    protected size_changed: boolean;
    protected data_changed: boolean;
    protected visuals_changed: boolean;
    constructor(gl: WebGLRenderingContext, glyph: GlyphView);
    protected abstract init(): void;
    set_data_changed(): void;
    set_visuals_changed(): void;
    render(_ctx: Context2d, indices: number[], mainglyph: GlyphView): boolean;
    abstract draw(indices: number[], mainglyph: any, trans: Transform): void;
}
export declare type Transform = {
    pixel_ratio: number;
    width: number;
    height: number;
};
