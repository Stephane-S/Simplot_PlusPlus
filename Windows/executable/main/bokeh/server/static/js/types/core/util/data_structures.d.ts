import { Arrayable } from "../types";
import { equals, Equals, Comparator } from "./eq";
export declare class BitSet implements Equals {
    readonly size: number;
    private readonly _array;
    private readonly _nwords;
    constructor(size: number, init?: Uint32Array | 1 | 0);
    [Symbol.toStringTag]: string;
    clone(): BitSet;
    [equals](that: this, cmp: Comparator): boolean;
    static all_set(size: number): BitSet;
    static all_unset(size: number): BitSet;
    static from_indices(size: number, indices: number[]): BitSet;
    static from_booleans(size: number, booleans: boolean[]): BitSet;
    private _check_bounds;
    get(k: number): boolean;
    set(k: number, v?: boolean): void;
    unset(k: number): void;
    [Symbol.iterator](): Iterator<number>;
    private _count;
    get count(): number;
    protected _get_count(): number;
    ones(): Iterable<number>;
    zeros(): Iterable<number>;
    private _check_size;
    add(other: BitSet): void;
    intersect(other: BitSet): void;
    subtract(other: BitSet): void;
    union(other: BitSet): BitSet;
    intersection(other: BitSet): BitSet;
    difference(other: BitSet): BitSet;
    select<T>(array: Arrayable<T>): Arrayable<T>;
}
export declare namespace Matrix {
    type MapFn<T, U> = (value: T, row: number, col: number) => U;
}
export declare class Matrix<T> {
    readonly nrows: number;
    readonly ncols: number;
    private _matrix;
    constructor(nrows: number, ncols: number, init: (row: number, col: number) => T);
    at(row: number, col: number): T;
    [Symbol.iterator](): Iterator<[T, number, number]>;
    values(): Iterable<T>;
    map<U>(fn: Matrix.MapFn<T, U>): Matrix<U>;
    apply<U>(obj: Matrix<Matrix.MapFn<T, U>> | Matrix.MapFn<T, U>[][]): Matrix<U>;
    to_sparse(): [T, number, number][];
    static from<U>(obj: U[], ncols: number): Matrix<U>;
    static from<U>(obj: Matrix<U> | U[][]): Matrix<U>;
}
