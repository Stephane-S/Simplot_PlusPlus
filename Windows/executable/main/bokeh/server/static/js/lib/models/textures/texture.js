import { Model } from "../../model";
import * as p from "../../core/properties";
export class Texture extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_Texture() {
        this.define({
            repetition: [p.TextureRepetition, "repeat"],
        });
    }
    onload(defer_func) {
        defer_func();
    }
}
Texture.__name__ = "Texture";
Texture.init_Texture();
//# sourceMappingURL=texture.js.map