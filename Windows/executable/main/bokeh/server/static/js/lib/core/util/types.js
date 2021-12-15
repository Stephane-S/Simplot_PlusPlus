//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
import { every } from "./array";
const toString = Object.prototype.toString;
export function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}
export function isNumber(obj) {
    return toString.call(obj) === "[object Number]";
}
export function isInteger(obj) {
    return isNumber(obj) && Number.isInteger(obj);
}
export function isString(obj) {
    return toString.call(obj) === "[object String]";
}
export function isFunction(obj) {
    return toString.call(obj) === "[object Function]";
}
export function isArray(obj) {
    return Array.isArray(obj);
}
export function isArrayOf(arr, predicate) {
    return every(arr, predicate);
}
export function isArrayableOf(arr, predicate) {
    for (let i = 0, end = arr.length; i < end; i++) {
        if (!predicate(arr[i]))
            return false;
    }
    return true;
}
export function isTypedArray(obj) {
    return ArrayBuffer.isView(obj) && !(obj instanceof DataView);
}
export function isObject(obj) {
    const tp = typeof obj;
    return tp === 'function' || tp === 'object' && !!obj;
}
export function isPlainObject(obj) {
    return isObject(obj) && (obj.constructor == null || obj.constructor === Object);
}
export function isIterable(obj) {
    return Symbol.iterator in Object(obj);
}
//# sourceMappingURL=types.js.map