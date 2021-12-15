import { PlainObject } from "../types";
export declare const pretty: unique symbol;
export interface Printable {
    [pretty](printer: Printer): string;
}
export declare type PrinterOptions = {
    precision?: number;
};
export declare class Printer {
    readonly precision?: number;
    constructor(options?: PrinterOptions);
    to_string(obj: unknown): string;
    token(val: string): string;
    boolean(val: boolean): string;
    number(val: number): string;
    string(val: string): string;
    array(obj: Iterable<unknown>): string;
    iterable(obj: Iterable<unknown>): string;
    object(obj: PlainObject): string;
}
export declare function to_string(obj: unknown, options?: PrinterOptions): string;
