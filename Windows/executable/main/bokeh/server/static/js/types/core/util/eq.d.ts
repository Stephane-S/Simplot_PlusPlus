import { PlainObject } from "../types";
export declare const equals: unique symbol;
export interface Equals {
    [equals](that: this, cmp: Comparator): boolean;
}
export declare const wildcard: any;
export declare class Comparator {
    private readonly a_stack;
    private readonly b_stack;
    eq(a: any, b: any): boolean;
    numbers(a: number, b: number): boolean;
    arrays(a: ArrayLike<unknown>, b: ArrayLike<unknown>): boolean;
    iterables(a: Iterable<unknown>, b: Iterable<unknown>): boolean;
    maps(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean;
    sets(a: Set<unknown>, b: Set<unknown>): boolean;
    objects(a: PlainObject, b: PlainObject): boolean;
    nodes(a: Node, b: Node): boolean;
}
export declare class SimilarComparator extends Comparator {
    readonly tolerance: number;
    constructor(tolerance?: number);
    numbers(a: number, b: number): boolean;
}
export declare function is_equal(a: unknown, b: unknown): boolean;
export declare function is_similar(a: unknown, b: unknown, tolerance?: number): boolean;
/** @deprecated */
export declare const isEqual: typeof is_equal;
