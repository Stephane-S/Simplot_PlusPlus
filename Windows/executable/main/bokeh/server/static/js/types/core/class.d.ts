export interface Class<T, Args extends any[] = any[]> {
    new (...args: Args): T;
    prototype: T;
}
export declare type Constructor<T = {}> = new (...args: any[]) => T;
