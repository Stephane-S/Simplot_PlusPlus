/**
 * Based on https://github.com/gliffy/canvas2svg
 */
import { AffineTransform } from "./affine";
declare type KV<T> = {
    [key: string]: T;
};
declare type FontData = {
    style: string;
    size: string;
    family: string;
    weight: string;
    decoration: string;
    href?: string;
};
declare type Style = {
    svgAttr?: string;
    canvas: unknown;
    svg?: unknown;
    apply?: string;
};
declare type StyleAttr = "strokeStyle" | "fillStyle" | "lineCap" | "lineJoin" | "miterLimit" | "lineWidth" | "globalAlpha" | "font" | "shadowColor" | "shadowOffsetX" | "shadowOffsetY" | "shadowBlur" | "textAlign" | "textBaseline" | "lineDash";
declare type StyleState = {
    [key in StyleAttr]: Style;
};
declare class CanvasGradient {
    __root: SVGElement;
    __ctx: SVGRenderingContext2D;
    constructor(gradientNode: SVGElement, ctx: SVGRenderingContext2D);
    /**
     * Adds a color stop to the gradient root
     */
    addColorStop(offset: number, color: string): void;
}
declare class CanvasPattern {
    __root: SVGPatternElement;
    __ctx: SVGRenderingContext2D;
    constructor(pattern: SVGPatternElement, ctx: SVGRenderingContext2D);
}
declare type Options = {
    width?: number;
    height?: number;
    document?: Document;
    ctx?: CanvasRenderingContext2D;
};
declare type Path = string;
declare type CanvasState = {
    transform: AffineTransform;
    clip_path: Path | null;
    attributes: StyleState;
};
/**
 * The mock canvas context
 * @param o - options include:
 * ctx - existing Context2D to wrap around
 * width - width of your canvas (defaults to 500)
 * height - height of your canvas (defaults to 500)
 * document - the document object (defaults to the current document)
 */
export declare class SVGRenderingContext2D {
    __canvas: HTMLCanvasElement;
    __ctx: CanvasRenderingContext2D;
    __root: SVGSVGElement;
    __ids: KV<string>;
    __defs: SVGElement;
    __stack: CanvasState[];
    __document: Document;
    __currentElement: SVGElement;
    __currentDefaultPath: string;
    __currentPosition: {
        x: number;
        y: number;
    } | null;
    __currentElementsToStyle: {
        element: SVGElement;
        children: SVGElement[];
    } | null;
    __fontUnderline?: string;
    __fontHref?: string;
    get canvas(): this;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    fillStyle: string | CanvasGradient | CanvasPattern;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    miterLimit: number;
    lineWidth: number;
    globalAlpha: number;
    font: string;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    lineDash: string | number[] | null;
    private _width;
    private _height;
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    private _transform;
    constructor(options?: Options);
    /**
     * Creates the specified svg element
     */
    __createElement(elementName: string, properties?: KV<string | number>, resetFill?: boolean): SVGElement;
    /**
     * Applies default canvas styles to the context
     */
    __setDefaultStyles(): void;
    /**
     * Applies styles on restore
     */
    __applyStyleState(styleState: StyleState): void;
    /**
     * Gets the current style state
     */
    __getStyleState(): StyleState;
    /**
     * Apples the current styles to the current SVG element. On "ctx.fill" or "ctx.stroke"
     */
    __applyStyleToCurrentElement(type: string): void;
    /**
      * Returns the serialized value of the svg so far
      * @param fixNamedEntities - Standalone SVG doesn't support named entities, which document.createTextNode encodes.
      *                           If true, we attempt to find all named entities and encode it as a numeric entity.
      * @return serialized svg
      */
    get_serialized_svg(fixNamedEntities?: boolean): string;
    get_svg(): SVGSVGElement;
    /**
      * Will generate a group tag.
      */
    save(): void;
    /**
      * Sets current element to parent, or just root if already root
      */
    restore(): void;
    private _apply_transform;
    /**
      *  scales the current element
      */
    scale(x: number, y?: number): void;
    /**
      * rotates the current element
      */
    rotate(angle: number): void;
    /**
      * translates the current element
      */
    translate(x: number, y: number): void;
    /**
      * applies a transform to the current element
      */
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    /**
      * Create a new Path Element
      */
    beginPath(): void;
    /**
      * Helper function to apply currentDefaultPath to current path element
      */
    __applyCurrentDefaultPath(): void;
    /**
      * Helper function to add path command
      */
    __addPathCommand(x: number, y: number, path: string): void;
    get _hasCurrentDefaultPath(): boolean;
    /**
      * Adds the move command to the current path element,
      * if the currentPathElement is not empty create a new path element
      */
    moveTo(x: number, y: number): void;
    /**
      * Closes the current path
      */
    closePath(): void;
    /**
      * Adds a line to command
      */
    lineTo(x: number, y: number): void;
    /**
      * Add a bezier command
      */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /**
      * Adds a quadratic curve to command
      */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /**
      * Adds the arcTo to the current path
      *
      * @see http://www.w3.org/TR/2015/WD-2dcontext-20150514/#dom-context-2d-arcto
      */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /**
      * Sets the stroke property on the current element
      */
    stroke(): void;
    /**
      * Sets fill properties on the current element
      */
    fill(): void;
    /**
      *  Adds a rectangle to the path.
      */
    rect(x: number, y: number, width: number, height: number): void;
    /**
      * adds a rectangle element
      */
    fillRect(x: number, y: number, width: number, height: number): void;
    /**
      * Draws a rectangle with no fill
      * @param x
      * @param y
      * @param width
      * @param height
      */
    strokeRect(x: number, y: number, width: number, height: number): void;
    /**
      * Clear entire canvas:
      * 1. save current transforms
      * 2. remove all the childNodes of the root g element
      */
    __clearCanvas(): void;
    /**
      * "Clears" a canvas by just drawing a white rectangle in the current group.
      */
    clearRect(x: number, y: number, width: number, height: number): void;
    /**
      * Adds a linear gradient to a defs tag.
      * Returns a canvas gradient object that has a reference to it's parent def
      */
    createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradient;
    /**
      * Adds a radial gradient to a defs tag.
      * Returns a canvas gradient object that has a reference to it's parent def
      */
    createRadialGradient(x0: number, y0: number, _r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    /**
      * Parses the font string and returns svg mapping
      */
    __parseFont(): FontData;
    /**
      * Helper to link text fragments
      */
    __wrapTextLink(font: FontData, element: SVGElement): Element;
    /**
      * Fills or strokes text
      */
    __applyText(text: string, x: number, y: number, action: "fill" | "stroke"): void;
    /**
      * Creates a text element
      */
    fillText(text: string, x: number, y: number): void;
    /**
      * Strokes text
      */
    strokeText(text: string, x: number, y: number): void;
    /**
      * No need to implement this for svg.
      */
    measureText(text: string): TextMetrics;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterClockwise?: boolean): void;
    private _clip_path;
    /**
      * Generates a ClipPath from the clip command.
      */
    clip(): void;
    /**
      * Draws a canvas, image or mock context to this canvas.
      * Note that all svg dom manipulation uses node.childNodes rather than node.children for IE support.
      * http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
      */
    drawImage(image: CanvasImageSource, ...args: number[]): void;
    /**
      * Generates a pattern tag
      */
    createPattern(image: CanvasImageSource, _repetition: string): CanvasPattern;
    setLineDash(dashArray: number[]): void;
    private _to_number;
}
export {};
