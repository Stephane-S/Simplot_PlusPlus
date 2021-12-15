import { Layoutable, ContentLayoutable } from "./layoutable";
import { Size, SizeHint, Sizeable } from "./types";
export declare class ContentBox extends ContentLayoutable {
    private content_size;
    constructor(el: HTMLElement);
    protected _content_size(): Sizeable;
}
export declare class VariadicBox extends Layoutable {
    readonly el: HTMLElement;
    constructor(el: HTMLElement);
    protected _measure(viewport: Size): SizeHint;
}
export declare class CachedVariadicBox extends VariadicBox {
    private readonly _cache;
    constructor(el: HTMLElement);
    protected _measure(viewport: Size): SizeHint;
    invalidate_cache(): void;
}
