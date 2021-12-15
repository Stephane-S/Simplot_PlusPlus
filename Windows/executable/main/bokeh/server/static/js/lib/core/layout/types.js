import { Enum } from "../kinds";
const { min, max } = Math;
export class Sizeable {
    constructor(size = {}) {
        this.width = size.width != null ? size.width : 0;
        this.height = size.height != null ? size.height : 0;
    }
    bounded_to({ width, height }) {
        return new Sizeable({
            width: this.width == Infinity && width != null ? width : this.width,
            height: this.height == Infinity && height != null ? height : this.height,
        });
    }
    expanded_to({ width, height }) {
        return new Sizeable({
            width: width != Infinity ? max(this.width, width) : this.width,
            height: height != Infinity ? max(this.height, height) : this.height,
        });
    }
    expand_to({ width, height }) {
        this.width = max(this.width, width);
        this.height = max(this.height, height);
    }
    narrowed_to({ width, height }) {
        return new Sizeable({
            width: min(this.width, width),
            height: min(this.height, height),
        });
    }
    narrow_to({ width, height }) {
        this.width = min(this.width, width);
        this.height = min(this.height, height);
    }
    grow_by({ left, right, top, bottom }) {
        const width = this.width + left + right;
        const height = this.height + top + bottom;
        return new Sizeable({ width, height });
    }
    shrink_by({ left, right, top, bottom }) {
        const width = max(this.width - left - right, 0);
        const height = max(this.height - top - bottom, 0);
        return new Sizeable({ width, height });
    }
    map(w_fn, h_fn) {
        return new Sizeable({
            width: w_fn(this.width),
            height: (h_fn != null ? h_fn : w_fn)(this.height),
        });
    }
}
Sizeable.__name__ = "Sizeable";
export const SizingPolicy = Enum("fixed", "fit", "min", "max");
//# sourceMappingURL=types.js.map