import { isArray } from "./types";
import { clamp } from "./math";
export function is_empty(array) {
    return array.length == 0;
}
export function copy(array) {
    if (isArray(array))
        return array.slice();
    else
        return new array.constructor(array);
}
export function splice(array, start, k, ...items) {
    const len = array.length;
    if (start < 0)
        start += len;
    if (start < 0)
        start = 0;
    else if (start > len)
        start = len;
    if (k == null || k > len - start)
        k = len - start;
    else if (k < 0)
        k = 0;
    const n = len - k + items.length;
    const result = new array.constructor(n);
    let i = 0;
    for (; i < start; i++) {
        result[i] = array[i];
    }
    for (const item of items) {
        result[i++] = item;
    }
    for (let j = start + k; j < len; j++) {
        result[i++] = array[j];
    }
    return result;
}
export function head(array, n) {
    return splice(array, n, array.length - n);
}
export function insert(array, item, i) {
    return splice(array, i, 0, item);
}
export function append(array, item) {
    return splice(array, array.length, 0, item);
}
export function prepend(array, item) {
    return splice(array, 0, 0, item);
}
export function indexOf(array, item) {
    for (let i = 0, n = array.length; i < n; i++) {
        if (array[i] === item)
            return i;
    }
    return -1;
}
export function subselect(array, indices) {
    const n = indices.length;
    const result = new array.constructor(n);
    for (let i = 0; i < n; i++) {
        result[i] = array[indices[i]];
    }
    return result;
}
export function map(array, fn) {
    const n = array.length;
    const result = new array.constructor(n);
    for (let i = 0; i < n; i++) {
        result[i] = fn(array[i], i, array);
    }
    return result;
}
export function filter(array, pred) {
    const n = array.length;
    const result = new array.constructor(n);
    let k = 0;
    for (let i = 0; i < n; i++) {
        const value = array[i];
        if (pred(value, i, array))
            result[k++] = value;
    }
    return head(result, k);
}
export function reduce(array, fn, initial) {
    const n = array.length;
    if (initial === undefined && n == 0)
        throw new Error("can't reduce an empty array without an initial value");
    let value;
    let i;
    if (initial === undefined) {
        value = array[0];
        i = 1;
    }
    else {
        value = initial;
        i = 0;
    }
    for (; i < n; i++) {
        value = fn(value, array[i], i, array);
    }
    return value;
}
export function min(array) {
    let value;
    let result = Infinity;
    for (let i = 0, length = array.length; i < length; i++) {
        value = array[i];
        if (!isNaN(value) && value < result) {
            result = value;
        }
    }
    return result;
}
export function max(array) {
    let value;
    let result = -Infinity;
    for (let i = 0, length = array.length; i < length; i++) {
        value = array[i];
        if (!isNaN(value) && value > result) {
            result = value;
        }
    }
    return result;
}
export function minmax(array) {
    let value;
    let min = +Infinity;
    let max = -Infinity;
    for (let i = 0, length = array.length; i < length; i++) {
        value = array[i];
        if (!isNaN(value)) {
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
    }
    return [min, max];
}
export function min_by(array, key) {
    if (array.length == 0)
        throw new Error("min_by() called with an empty array");
    let result = array[0];
    let resultComputed = key(result);
    for (let i = 1, length = array.length; i < length; i++) {
        const value = array[i];
        const computed = key(value);
        if (computed < resultComputed) {
            result = value;
            resultComputed = computed;
        }
    }
    return result;
}
export function max_by(array, key) {
    if (array.length == 0)
        throw new Error("max_by() called with an empty array");
    let result = array[0];
    let resultComputed = key(result);
    for (let i = 1, length = array.length; i < length; i++) {
        const value = array[i];
        const computed = key(value);
        if (computed > resultComputed) {
            result = value;
            resultComputed = computed;
        }
    }
    return result;
}
export function sum(array) {
    let result = 0;
    for (let i = 0, n = array.length; i < n; i++) {
        result += array[i];
    }
    return result;
}
export function cumsum(array) {
    const result = new array.constructor(array.length);
    reduce(array, (a, b, i) => result[i] = a + b, 0);
    return result;
}
export function every(array, predicate) {
    for (let i = 0, length = array.length; i < length; i++) {
        if (!predicate(array[i]))
            return false;
    }
    return true;
}
export function some(array, predicate) {
    for (let i = 0, length = array.length; i < length; i++) {
        if (predicate(array[i]))
            return true;
    }
    return false;
}
export function index_of(array, value) {
    for (let i = 0, length = array.length; i < length; i++) {
        if (array[i] === value)
            return i;
    }
    return -1;
}
function _find_index(dir) {
    return function (array, predicate) {
        const length = array.length;
        let index = dir > 0 ? 0 : length - 1;
        for (; index >= 0 && index < length; index += dir) {
            if (predicate(array[index]))
                return index;
        }
        return -1;
    };
}
export const find_index = _find_index(1);
export const find_last_index = _find_index(-1);
export function find(array, predicate) {
    const index = find_index(array, predicate);
    return index == -1 ? undefined : array[index];
}
export function find_last(array, predicate) {
    const index = find_last_index(array, predicate);
    return index == -1 ? undefined : array[index];
}
export function sorted_index(array, value) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (array[mid] < value)
            low = mid + 1;
        else
            high = mid;
    }
    return low;
}
export function bin_counts(data, bin_edges) {
    const nbins = bin_edges.length - 1;
    const counts = Array(nbins).fill(0);
    for (let i = 0; i < data.length; i++) {
        const sample = data[i];
        const index = sorted_index(bin_edges, sample);
        const bin = clamp(index - 1, 0, nbins - 1);
        counts[bin] += 1;
    }
    return counts;
}
export function interpolate(points, x_values, y_values) {
    // Implementation ported from np.interp
    const n = points.length;
    const results = new Array(n);
    for (let i = 0; i < n; i++) {
        const point = points[i];
        if (isNaN(point)) {
            results[i] = point;
            continue;
        }
        const index = left_edge_index(point, x_values);
        if (index == -1)
            results[i] = y_values[0];
        else if (index == x_values.length)
            results[i] = y_values[y_values.length - 1];
        else if (index == x_values.length - 1 || x_values[index] == point) {
            results[i] = y_values[index];
        }
        else {
            const x0 = x_values[index];
            const y0 = y_values[index];
            const x1 = x_values[index + 1];
            const y1 = y_values[index + 1];
            results[i] = lerp(point, x0, y0, x1, y1);
        }
    }
    return results;
}
function lerp(x, x0, y0, x1, y1) {
    const slope = (y1 - y0) / (x1 - x0);
    let res = slope * (x - x0) + y0;
    if (!isFinite(res)) {
        res = slope * (x - x1) + y1;
        if (!isFinite(res) && (y0 == y1))
            res = y0;
    }
    return res;
}
export function left_edge_index(point, intervals) {
    if (point < intervals[0])
        return -1;
    if (point > intervals[intervals.length - 1])
        return intervals.length;
    let leftEdgeIndex = 0;
    let rightEdgeIndex = intervals.length - 1;
    while (rightEdgeIndex - leftEdgeIndex != 1) {
        const indexOfNumberToCompare = leftEdgeIndex + Math.floor((rightEdgeIndex - leftEdgeIndex) / 2);
        if (point >= intervals[indexOfNumberToCompare])
            leftEdgeIndex = indexOfNumberToCompare;
        else
            rightEdgeIndex = indexOfNumberToCompare;
    }
    return leftEdgeIndex;
}
export function norm(array, start, end) {
    const span = end - start;
    return map(array, (x) => (x - start) / span);
}
//# sourceMappingURL=arrayable.js.map