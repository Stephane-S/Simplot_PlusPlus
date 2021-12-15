//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
import { randomIn } from "./math";
import { assert } from "./assert";
import { map, reduce, min, min_by, max, max_by, sum, cumsum, every, some, find, find_last, find_index, find_last_index, sorted_index, is_empty } from "./arrayable";
export { map, reduce, min, min_by, max, max_by, sum, cumsum, every, some, find, find_last, find_index, find_last_index, sorted_index, is_empty };
const slice = Array.prototype.slice;
export function head(array) {
    return array[0];
}
export function tail(array) {
    return array[array.length - 1];
}
export function last(array) {
    return array[array.length - 1];
}
export function copy(array) {
    return slice.call(array);
}
export function concat(arrays) {
    return [].concat(...arrays);
}
export function includes(array, value) {
    return array.indexOf(value) !== -1;
}
export const contains = includes;
export function nth(array, index) {
    return array[index >= 0 ? index : array.length + index];
}
export function zip(...arrays) {
    if (arrays.length == 0)
        return [];
    const n = min(arrays.map((a) => a.length));
    const k = arrays.length;
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = new Array(k);
        for (let j = 0; j < k; j++)
            result[i][j] = arrays[j][i];
    }
    return result;
}
export function unzip(array) {
    const n = array.length;
    const k = min(array.map((a) => a.length));
    const results = Array(k);
    for (let j = 0; j < k; j++)
        results[j] = new Array(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < k; j++)
            results[j][i] = array[i][j];
    }
    return results;
}
export function range(start, stop, step = 1) {
    assert(step > 0, "'step' must be a positive number");
    if (stop == null) {
        stop = start;
        start = 0;
    }
    const { max, ceil, abs } = Math;
    const delta = start <= stop ? step : -step;
    const length = max(ceil(abs(stop - start) / step), 0);
    const range = new Array(length);
    for (let i = 0; i < length; i++, start += delta) {
        range[i] = start;
    }
    return range;
}
export function linspace(start, stop, num = 100) {
    const step = (stop - start) / (num - 1);
    const array = new Array(num);
    for (let i = 0; i < num; i++) {
        array[i] = start + step * i;
    }
    return array;
}
export function transpose(array) {
    const rows = array.length;
    const cols = array[0].length;
    const transposed = [];
    for (let j = 0; j < cols; j++) {
        transposed[j] = [];
        for (let i = 0; i < rows; i++) {
            transposed[j][i] = array[i][j];
        }
    }
    return transposed;
}
export function argmin(array) {
    return min_by(range(array.length), (i) => array[i]);
}
export function argmax(array) {
    return max_by(range(array.length), (i) => array[i]);
}
export function sort_by(array, key) {
    const tmp = array.map((value, index) => {
        return { value, index, key: key(value) };
    });
    tmp.sort((left, right) => {
        const a = left.key;
        const b = right.key;
        if (a !== b) {
            if (a > b || a === undefined)
                return 1;
            if (a < b || b === undefined)
                return -1;
        }
        return left.index - right.index;
    });
    return tmp.map((item) => item.value);
}
export function uniq(array) {
    const result = new Set();
    for (const value of array) {
        result.add(value);
    }
    return [...result];
}
export function uniq_by(array, key) {
    const result = [];
    const seen = [];
    for (const value of array) {
        const computed = key(value);
        if (!includes(seen, computed)) {
            seen.push(computed);
            result.push(value);
        }
    }
    return result;
}
export function union(...arrays) {
    const result = new Set();
    for (const array of arrays) {
        for (const value of array) {
            result.add(value);
        }
    }
    return [...result];
}
export function intersection(array, ...arrays) {
    const result = [];
    top: for (const item of array) {
        if (includes(result, item))
            continue;
        for (const other of arrays) {
            if (!includes(other, item))
                continue top;
        }
        result.push(item);
    }
    return result;
}
export function difference(array, ...arrays) {
    const rest = concat(arrays);
    return array.filter((value) => !includes(rest, value));
}
export function remove_at(array, i) {
    const result = copy(array);
    result.splice(i, 1);
    return result;
}
export function remove_by(array, key) {
    for (let i = 0; i < array.length;) {
        if (key(array[i]))
            array.splice(i, 1);
        else
            i++;
    }
}
// Shuffle a collection, using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
export function shuffle(array) {
    const length = array.length;
    const shuffled = new Array(length);
    for (let i = 0; i < length; i++) {
        const rand = randomIn(0, i);
        if (rand !== i)
            shuffled[i] = shuffled[rand];
        shuffled[rand] = array[i];
    }
    return shuffled;
}
export function pairwise(array, fn) {
    const n = array.length;
    const result = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
        result[i] = fn(array[i], array[i + 1]);
    }
    return result;
}
export function reversed(array) {
    const n = array.length;
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[n - i - 1] = array[i];
    }
    return result;
}
export function repeat(value, n) {
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = value;
    }
    return result;
}
//# sourceMappingURL=array.js.map