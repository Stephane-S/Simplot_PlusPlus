import { PlainObject } from "../types";
export declare const keys: {
    (o: object): string[];
    (o: {}): string[];
}, values: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): T[];
    (o: {}): any[];
}, entries: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
}, extend: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
export declare function clone<T>(obj: PlainObject<T>): PlainObject<T>;
export declare function merge<T>(obj1: PlainObject<T[]>, obj2: PlainObject<T[]>): PlainObject<T[]>;
export declare function size(obj: PlainObject): number;
export declare function isEmpty(obj: PlainObject): boolean;
export declare function to_object<T>(map: Map<string | number, T>): PlainObject<T>;
