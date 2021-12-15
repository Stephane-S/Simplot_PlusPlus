import { Mapper } from "./mapper";
import { Factor } from "../ranges/factor_range";
import * as p from "../../core/properties";
import { Arrayable, ArrayableOf, Color } from "../../core/types";
export interface RGBAMapper {
    v_compute(xs: Arrayable<number> | Arrayable<Factor>): Uint8Array;
}
export declare function _convert_color(color: string | number): number;
export declare function _convert_palette(palette: (Color | number)[]): Uint32Array;
export declare function _uint32_to_rgba(values: Uint32Array): Uint8Array;
export declare namespace ColorMapper {
    type Attrs = p.AttrsOf<Props>;
    type Props = Mapper.Props & {
        palette: p.Property<(Color | number)[]>;
        nan_color: p.Property<Color>;
    };
}
export interface ColorMapper extends ColorMapper.Attrs {
}
export declare abstract class ColorMapper extends Mapper<Color> {
    properties: ColorMapper.Props;
    constructor(attrs?: Partial<ColorMapper.Attrs>);
    static init_ColorMapper(): void;
    v_compute(xs: ArrayableOf<number | Factor>): Arrayable<Color>;
    get rgba_mapper(): RGBAMapper;
    protected _colors<T>(conv: (c: Color) => T): {
        nan_color: T;
    };
    protected abstract _v_compute<T>(xs: ArrayableOf<number | Factor>, values: Arrayable<T>, palette: Arrayable<T>, colors: {
        nan_color: T;
    }): void;
}
