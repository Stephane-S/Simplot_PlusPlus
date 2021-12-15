export declare class BuildError extends Error {
    readonly component: string;
    constructor(component: string, message: string);
}
