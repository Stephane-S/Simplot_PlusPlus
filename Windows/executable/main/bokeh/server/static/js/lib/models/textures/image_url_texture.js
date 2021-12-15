import { Texture } from "./texture";
import * as p from "../../core/properties";
import { ImageLoader } from "../../core/util/image";
export class ImageURLTexture extends Texture {
    constructor(attrs) {
        super(attrs);
    }
    static init_ImageURLTexture() {
        this.define({
            url: [p.String],
        });
    }
    initialize() {
        super.initialize();
        this._loader = new ImageLoader(this.url);
    }
    get_pattern(_color, _scale, _weight) {
        return (ctx) => {
            if (!this._loader.finished) {
                return null;
            }
            return ctx.createPattern(this._loader.image, this.repetition);
        };
    }
    onload(defer_func) {
        this._loader.promise.then(() => defer_func());
    }
}
ImageURLTexture.__name__ = "ImageURLTexture";
ImageURLTexture.init_ImageURLTexture();
//# sourceMappingURL=image_url_texture.js.map