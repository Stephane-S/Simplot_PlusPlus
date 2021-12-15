import { XYGlyph, XYGlyphView, XYGlyphData } from "./xy_glyph";
import { PointGeometry } from "../../core/geometry";
import { Line, Fill, Hatch } from "../../core/visuals";
import { Arrayable, Rect } from "../../core/types";
import { Context2d } from "../../core/util/canvas";
import * as mixins from "../../core/property_mixins";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
export interface PatchData extends XYGlyphData {
}
export interface PatchView extends PatchData {
}
export declare class PatchView extends XYGlyphView {
    model: Patch;
    visuals: Patch.Visuals;
    protected _inner_loop(ctx: Context2d, indices: number[], sx: Arrayable<number>, sy: Arrayable<number>, func: (this: Context2d) => void): void;
    protected _render(ctx: Context2d, indices: number[], { sx, sy }: PatchData): void;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
    protected _hit_point(geometry: PointGeometry): Selection;
}
export declare namespace Patch {
    type Attrs = p.AttrsOf<Props>;
    type Props = XYGlyph.Props & Mixins;
    type Mixins = mixins.Line & mixins.Fill & mixins.Hatch;
    type Visuals = XYGlyph.Visuals & {
        line: Line;
        fill: Fill;
        hatch: Hatch;
    };
}
export interface Patch extends Patch.Attrs {
}
export declare class Patch extends XYGlyph {
    properties: Patch.Props;
    __view_type__: PatchView;
    constructor(attrs?: Partial<Patch.Attrs>);
    static init_Patch(): void;
}
