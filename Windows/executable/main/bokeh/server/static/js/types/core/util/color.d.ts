export declare function is_color(value: string): boolean;
export declare function rgb2hex(r: number, g: number, b: number): string;
export declare function color2hex(color: string): string;
export declare type RGBA = [number, number, number, number];
export declare function encode_rgba([r, g, b, a]: RGBA): number;
export declare function decode_rgba(rgba: number): RGBA;
export declare function color2rgba(color: string | null, alpha?: number): RGBA;
export declare function valid_rgb(value: string): boolean;
