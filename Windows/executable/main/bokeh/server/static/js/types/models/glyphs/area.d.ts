import { Glyph, GlyphView, GlyphData } from "./glyph";
import { Fill, Hatch } from "../../core/visuals";
import { Rect } from "../../core/types";
import { Context2d } from "../../core/util/canvas";
import * as p from "../../core/properties";
import * as mixins from "../../core/property_mixins";
export interface AreaData extends GlyphData {
}
export interface AreaView extends AreaData {
}
export declare abstract class AreaView extends GlyphView {
    model: Area;
    visuals: Area.Visuals;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
}
export declare namespace Area {
    type Attrs = p.AttrsOf<Props>;
    type Props = Glyph.Props & Mixins;
    type Mixins = mixins.Fill & mixins.HatchVector;
    type Visuals = Glyph.Visuals & {
        fill: Fill;
        hatch: Hatch;
    };
}
export interface Area extends Area.Attrs {
}
export declare class Area extends Glyph {
    properties: Area.Props;
    __view_type__: AreaView;
    constructor(attrs?: Partial<Area.Attrs>);
    static init_Area(): void;
}
