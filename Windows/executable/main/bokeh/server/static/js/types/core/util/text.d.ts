import { Size } from "../types";
export interface FontMetrics {
    height: number;
    ascent: number;
    descent: number;
}
export declare function measure_font(font: string): FontMetrics;
export declare function measure_text(text: string, font: string): Size;
