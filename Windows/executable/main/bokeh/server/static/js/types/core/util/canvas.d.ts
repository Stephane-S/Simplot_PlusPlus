export declare type Context2d = {
    setImageSmoothingEnabled(value: boolean): void;
    getImageSmoothingEnabled(): boolean;
    measureText(text: string): TextMetrics & {
        ascent: number;
    };
    lineDash: number[];
} & CanvasRenderingContext2D;
export declare function fixup_ctx(ctx: any): void;
