import FlatBush from "flatbush";
import { Indices } from "../types";
import { empty } from "./bbox";
function upperBound(value, arr) {
    let i = 0;
    let j = arr.length - 1;
    while (i < j) {
        const m = (i + j) >> 1;
        if (arr[m] > value) {
            j = m;
        }
        else {
            i = m + 1;
        }
    }
    return arr[i];
}
class _FlatBush extends FlatBush {
    search_indices(minX, minY, maxX, maxY) {
        if (this._pos !== this._boxes.length) {
            throw new Error('Data not yet indexed - call index.finish().');
        }
        let nodeIndex = this._boxes.length - 4;
        const queue = [];
        const results = new Indices(this.numItems);
        while (nodeIndex !== undefined) {
            // find the end index of the node
            const end = Math.min(nodeIndex + this.nodeSize * 4, upperBound(nodeIndex, this._levelBounds));
            // search through child nodes
            for (let pos = nodeIndex; pos < end; pos += 4) {
                const index = this._indices[pos >> 2] | 0;
                // check if node bbox intersects with query bbox
                if (maxX < this._boxes[pos + 0])
                    continue; // maxX < nodeMinX
                if (maxY < this._boxes[pos + 1])
                    continue; // maxY < nodeMinY
                if (minX > this._boxes[pos + 2])
                    continue; // minX > nodeMaxX
                if (minY > this._boxes[pos + 3])
                    continue; // minY > nodeMaxY
                if (nodeIndex < this.numItems * 4) {
                    results.set(index); // leaf item
                }
                else {
                    queue.push(index); // node; add it to the search queue
                }
            }
            nodeIndex = queue.pop();
        }
        return results;
    }
}
_FlatBush.__name__ = "_FlatBush";
export class SpatialIndex {
    constructor(size) {
        this.index = null;
        if (size > 0) {
            this.index = new _FlatBush(size);
        }
    }
    add(x0, y0, x1, y1) {
        var _a;
        (_a = this.index) === null || _a === void 0 ? void 0 : _a.add(x0, y0, x1, y1);
    }
    add_empty() {
        var _a;
        (_a = this.index) === null || _a === void 0 ? void 0 : _a.add(Infinity, Infinity, -Infinity, -Infinity);
    }
    finish() {
        var _a;
        (_a = this.index) === null || _a === void 0 ? void 0 : _a.finish();
    }
    _normalize(rect) {
        let { x0, y0, x1, y1 } = rect;
        if (x0 > x1)
            [x0, x1] = [x1, x0];
        if (y0 > y1)
            [y0, y1] = [y1, y0];
        return { x0, y0, x1, y1 };
    }
    get bbox() {
        if (this.index == null)
            return empty();
        else {
            const { minX, minY, maxX, maxY } = this.index;
            return { x0: minX, y0: minY, x1: maxX, y1: maxY };
        }
    }
    indices(rect) {
        if (this.index == null)
            return new Indices(0);
        else {
            const { x0, y0, x1, y1 } = this._normalize(rect);
            return this.index.search_indices(x0, y0, x1, y1);
        }
    }
    bounds(rect) {
        const bounds = empty();
        for (const i of this.indices(rect)) {
            const boxes = this.index._boxes;
            const x1 = boxes[4 * i + 0];
            const y1 = boxes[4 * i + 1];
            const x0 = boxes[4 * i + 2];
            const y0 = boxes[4 * i + 3];
            if (x0 < bounds.x0)
                bounds.x0 = x0;
            if (x1 > bounds.x1)
                bounds.x1 = x1;
            if (y0 < bounds.y0)
                bounds.y0 = y0;
            if (y1 > bounds.y1)
                bounds.y1 = y1;
        }
        return bounds;
    }
}
SpatialIndex.__name__ = "SpatialIndex";
//# sourceMappingURL=spatial.js.map