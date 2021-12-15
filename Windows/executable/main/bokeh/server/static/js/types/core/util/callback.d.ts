export declare function delay(func: () => void, wait: number): number;
export declare function defer<T>(func: () => T): Promise<T>;
export interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}
export declare function throttle<T>(func: () => T, wait: number, options?: ThrottleOptions): (this: any) => T;
export declare function once<T>(func: () => T): () => T;
