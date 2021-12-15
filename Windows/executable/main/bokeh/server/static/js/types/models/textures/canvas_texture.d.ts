import { Texture } from "./texture";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare namespace CanvasTexture {
    type Attrs = p.AttrsOf<Props>;
    type Props = Texture.Props & {
        code: p.Property<string>;
    };
}
export interface CanvasTexture extends CanvasTexture.Attrs {
}
export declare abstract class CanvasTexture extends Texture {
    properties: CanvasTexture.Props;
    constructor(attrs?: Partial<CanvasTexture.Attrs>);
    static init_CanvasTexture(): void;
    get func(): Function;
    get_pattern(color: any, scale: number, weight: number): (ctx: Context2d) => CanvasPattern | null;
}
