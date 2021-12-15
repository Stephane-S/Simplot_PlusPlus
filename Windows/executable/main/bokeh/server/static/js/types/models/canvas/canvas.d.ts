import { HasProps } from "../../core/has_props";
import { DOMView } from "../../core/dom_view";
import * as p from "../../core/properties";
import { OutputBackend } from "../../core/enums";
import { BBox } from "../../core/util/bbox";
import { Context2d } from "../../core/util/canvas";
export declare type FrameBox = [number, number, number, number];
export declare type WebGLState = {
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGLRenderingContext;
};
export declare class CanvasLayer {
    readonly backend: OutputBackend;
    readonly hidpi: boolean;
    private readonly _canvas;
    get canvas(): HTMLCanvasElement;
    private readonly _ctx;
    get ctx(): Context2d;
    private readonly _el;
    get el(): HTMLElement;
    readonly pixel_ratio: number;
    bbox: BBox;
    constructor(backend: OutputBackend, hidpi: boolean);
    resize(width: number, height: number): void;
    prepare(): void;
    clear(): void;
    finish(): void;
    to_blob(): Promise<Blob>;
}
export declare class CanvasView extends DOMView {
    model: Canvas;
    bbox: BBox;
    webgl?: WebGLState;
    underlays_el: HTMLElement;
    primary: CanvasLayer;
    overlays: CanvasLayer;
    overlays_el: HTMLElement;
    events_el: HTMLElement;
    initialize(): void;
    add_underlay(el: HTMLElement): void;
    add_overlay(el: HTMLElement): void;
    add_event(el: HTMLElement): void;
    get pixel_ratio(): number;
    resize(width: number, height: number): void;
    prepare_webgl(frame_box: FrameBox): void;
    clear_webgl(): void;
    blit_webgl(ctx: Context2d): void;
    compose(): CanvasLayer;
    to_blob(): Promise<Blob>;
}
export declare namespace Canvas {
    type Attrs = p.AttrsOf<Props>;
    type Props = HasProps.Props & {
        hidpi: p.Property<boolean>;
        output_backend: p.Property<OutputBackend>;
    };
}
export interface Canvas extends Canvas.Attrs {
}
export declare class Canvas extends HasProps {
    properties: Canvas.Props;
    __view_type__: CanvasView;
    constructor(attrs?: Partial<Canvas.Attrs>);
    static init_Canvas(): void;
}
