import { ImageBase, ImageBaseView } from "./image_base";
import { isArray } from "../../core/util/types";
export class ImageRGBAView extends ImageBaseView {
    _flat_img_to_buf8(img) {
        let array;
        if (isArray(img)) {
            array = new Uint32Array(img);
        }
        else {
            array = img;
        }
        return new Uint8Array(array.buffer);
    }
}
ImageRGBAView.__name__ = "ImageRGBAView";
export class ImageRGBA extends ImageBase {
    constructor(attrs) {
        super(attrs);
    }
    static init_ImageRGBA() {
        this.prototype.default_view = ImageRGBAView;
    }
}
ImageRGBA.__name__ = "ImageRGBA";
ImageRGBA.init_ImageRGBA();
//# sourceMappingURL=image_rgba.js.map