export const NumberArray = Float32Array;
export const ColorArray = Uint32Array;
import { equals } from "./util/eq";
export class RaggedArray {
    constructor(offsets, array) {
        this.offsets = offsets;
        this.array = array;
    }
    [equals](that, cmp) {
        return cmp.arrays(this.offsets, that.offsets) && cmp.arrays(this.array, that.array);
    }
    get length() {
        return this.offsets.length;
    }
    clone() {
        return new RaggedArray(new Uint32Array(this.offsets), new NumberArray(this.array));
    }
    static from(items) {
        const n = items.length;
        const offsets = new Uint32Array(n);
        let offset = 0;
        for (let i = 0; i < n; i++) {
            const length = items[i].length;
            offsets[i] = offset;
            offset += length;
        }
        const array = new NumberArray(offset);
        for (let i = 0; i < n; i++) {
            array.set(items[i], offsets[i]);
        }
        return new RaggedArray(offsets, array);
    }
    *[Symbol.iterator]() {
        const { offsets, length } = this;
        for (let i = 0; i < length; i++) {
            yield this.array.subarray(offsets[i], offsets[i + 1]);
        }
    }
    get(i) {
        const { offsets } = this;
        return this.array.subarray(offsets[i], offsets[i + 1]);
    }
    set(i, array) {
        this.array.set(array, this.offsets[i]);
    }
}
RaggedArray.__name__ = "RaggedArray";
RaggedArray[Symbol.toStringTag] = "RaggedArray";
export { BitSet as Indices } from "./util/data_structures";
//# sourceMappingURL=types.js.map