import { Layoutable, ContentLayoutable } from "./layoutable";
import { Sizeable } from "./types";
import { size, sized, unsized, content_size, extents } from "../dom";
export class ContentBox extends ContentLayoutable {
    constructor(el) {
        super();
        this.content_size = unsized(el, () => new Sizeable(size(el)));
    }
    _content_size() {
        return this.content_size;
    }
}
ContentBox.__name__ = "ContentBox";
export class VariadicBox extends Layoutable {
    constructor(el) {
        super();
        this.el = el;
    }
    _measure(viewport) {
        const bounded = new Sizeable(viewport).bounded_to(this.sizing.size);
        return sized(this.el, bounded, () => {
            const content = new Sizeable(content_size(this.el));
            const { border, padding } = extents(this.el);
            return content.grow_by(border).grow_by(padding).map(Math.ceil);
        });
    }
}
VariadicBox.__name__ = "VariadicBox";
export class CachedVariadicBox extends VariadicBox {
    constructor(el) {
        super(el);
        this._cache = new Map();
    }
    _measure(viewport) {
        const { width, height } = viewport;
        const key = `${width},${height}`;
        let size_hint = this._cache.get(key);
        if (size_hint == null) {
            size_hint = super._measure(viewport);
            this._cache.set(key, size_hint);
        }
        return size_hint;
    }
    invalidate_cache() {
        this._cache.clear();
    }
}
CachedVariadicBox.__name__ = "CachedVariadicBox";
//# sourceMappingURL=html.js.map