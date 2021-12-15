import { Model } from "../../model";
import { Color } from "../../core/types";
import { TextureRepetition } from "../../core/enums";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare namespace Texture {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        repetition: p.Property<TextureRepetition>;
    };
}
export interface Texture extends Texture.Attrs {
}
export declare abstract class Texture extends Model {
    properties: Texture.Props;
    constructor(attrs?: Partial<Texture.Attrs>);
    static init_Texture(): void;
    abstract get_pattern(color: Color, alpha: number, scale: number, weight: number): (ctx: Context2d) => CanvasPattern | null;
    onload(defer_func: () => void): void;
}
