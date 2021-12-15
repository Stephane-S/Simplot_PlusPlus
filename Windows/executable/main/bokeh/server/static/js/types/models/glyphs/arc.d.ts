import { XYGlyph, XYGlyphView, XYGlyphData } from "./xy_glyph";
import { LineVector } from "../../core/property_mixins";
import { Line } from "../../core/visuals";
import { Rect, NumberArray } from "../../core/types";
import { Direction } from "../../core/enums";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export interface ArcData extends XYGlyphData {
    _radius: NumberArray;
    _start_angle: NumberArray;
    _end_angle: NumberArray;
    sradius: NumberArray;
    max_radius: number;
}
export interface ArcView extends ArcData {
}
export declare class ArcView extends XYGlyphView {
    model: Arc;
    visuals: Arc.Visuals;
    protected _map_data(): void;
    protected _render(ctx: Context2d, indices: number[], { sx, sy, sradius, _start_angle, _end_angle }: ArcData): void;
    draw_legend_for_index(ctx: Context2d, bbox: Rect, index: number): void;
}
export declare namespace Arc {
    type Attrs = p.AttrsOf<Props>;
    type Props = XYGlyph.Props & {
        direction: p.Property<Direction>;
        radius: p.DistanceSpec;
        start_angle: p.AngleSpec;
        end_angle: p.AngleSpec;
    } & Mixins;
    type Mixins = LineVector;
    type Visuals = XYGlyph.Visuals & {
        line: Line;
    };
}
export interface Arc extends Arc.Attrs {
}
export declare class Arc extends XYGlyph {
    properties: Arc.Props;
    __view_type__: ArcView;
    constructor(attrs?: Partial<Arc.Attrs>);
    static init_Arc(): void;
}
