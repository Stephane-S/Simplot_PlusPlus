import { Texture } from "./texture";
import * as p from "../../core/properties";
import { use_strict } from "../../core/util/string";
export class CanvasTexture extends Texture {
    constructor(attrs) {
        super(attrs);
    }
    static init_CanvasTexture() {
        this.define({
            code: [p.String],
        });
    }
    get func() {
        const code = use_strict(this.code);
        return new Function("ctx", "color", "scale", "weight", code);
    }
    get_pattern(color, scale, weight) {
        return (ctx) => {
            const canvas = document.createElement('canvas');
            canvas.width = scale;
            canvas.height = scale;
            const pattern_ctx = canvas.getContext('2d');
            this.func.call(this, pattern_ctx, color, scale, weight);
            return ctx.createPattern(canvas, this.repetition);
        };
    }
}
CanvasTexture.__name__ = "CanvasTexture";
CanvasTexture.init_CanvasTexture();
//# sourceMappingURL=canvas_texture.js.map