import { Texture } from "./texture";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare namespace ImageURLTexture {
    type Attrs = p.AttrsOf<Props>;
    type Props = Texture.Props & {
        url: p.Property<string>;
    };
}
export interface ImageURLTexture extends ImageURLTexture.Attrs {
}
export declare abstract class ImageURLTexture extends Texture {
    properties: ImageURLTexture.Props;
    constructor(attrs?: Partial<ImageURLTexture.Attrs>);
    static init_ImageURLTexture(): void;
    initialize(): void;
    get_pattern(_color: any, _scale: number, _weight: number): (ctx: Context2d) => CanvasPattern | null;
    onload(defer_func: () => void): void;
    private _loader;
}
