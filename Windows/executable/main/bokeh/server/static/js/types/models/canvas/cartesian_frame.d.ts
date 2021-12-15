import { Scale } from "../scales/scale";
import { Range } from "../ranges/range";
import { Range1d } from "../ranges/range1d";
import { LayoutItem } from "../../core/layout";
import { BBox } from "../../core/util/bbox";
declare type Ranges = {
    [key: string]: Range;
};
export declare class CartesianFrame extends LayoutItem {
    private readonly in_x_scale;
    private readonly in_y_scale;
    readonly x_range: Range;
    readonly y_range: Range;
    private readonly extra_x_ranges;
    private readonly extra_y_ranges;
    constructor(in_x_scale: Scale, in_y_scale: Scale, x_range: Range, y_range: Range, extra_x_ranges?: Ranges, extra_y_ranges?: Ranges);
    protected _x_target: Range1d;
    protected _y_target: Range1d;
    protected _x_ranges: Map<string, Range>;
    protected _y_ranges: Map<string, Range>;
    protected _x_scales: Map<string, Scale>;
    protected _y_scales: Map<string, Scale>;
    protected _get_ranges(range: Range, extra_ranges: Ranges): Map<string, Range>;
    _get_scales(scale: Scale, ranges: Map<string, Range>, frame_range: Range): Map<string, Scale>;
    protected _configure_frame_ranges(): void;
    protected _configure_scales(): void;
    protected _update_scales(): void;
    protected _set_geometry(outer: BBox, inner: BBox): void;
    get x_ranges(): Map<string, Range>;
    get y_ranges(): Map<string, Range>;
    get x_scales(): Map<string, Scale>;
    get y_scales(): Map<string, Scale>;
    get x_scale(): Scale;
    get y_scale(): Scale;
    /** @deprecated */
    get xscales(): {
        [key: string]: Scale;
    };
    /** @deprecated */
    get yscales(): {
        [key: string]: Scale;
    };
}
export {};
