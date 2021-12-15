import { Arrayable, NumberArray } from "../../core/types";
import { Scale } from "../scales/scale";
import { Range } from "../ranges/range";
export declare class CoordinateTransform {
    readonly x_scale: Scale;
    readonly y_scale: Scale;
    readonly x_range: Range;
    readonly y_range: Range;
    readonly ranges: readonly [Range, Range];
    readonly scales: readonly [Scale, Scale];
    constructor(x_scale: Scale, y_scale: Scale);
    map_to_screen(xs: Arrayable<number>, ys: Arrayable<number>): [NumberArray, NumberArray];
    map_from_screen(sxs: Arrayable<number>, sys: Arrayable<number>): [NumberArray, NumberArray];
}
