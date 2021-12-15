import { Arrayable, TypedArray } from "../types";
export declare function isBoolean(obj: unknown): obj is boolean;
export declare function isNumber(obj: unknown): obj is number;
export declare function isInteger(obj: unknown): obj is number;
export declare function isString(obj: unknown): obj is string;
export declare function isFunction(obj: unknown): obj is Function;
export declare function isArray<T>(obj: unknown): obj is T[];
export declare function isArrayOf<T>(arr: unknown[], predicate: (item: unknown) => item is T): arr is T[];
export declare function isArrayableOf<T>(arr: Arrayable, predicate: (item: unknown) => item is T): arr is Arrayable<T>;
export declare function isTypedArray(obj: unknown): obj is TypedArray;
export declare function isObject(obj: unknown): obj is object;
export declare function isPlainObject(obj: unknown): obj is {
    [key: string]: unknown;
};
export declare function isIterable(obj: unknown): obj is Iterable<unknown>;
