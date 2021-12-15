import { HasProps } from "./core/has_props";
export declare const overrides: {
    [key: string]: typeof HasProps;
};
export interface Models {
    (name: string): typeof HasProps;
    register(name: string, model: typeof HasProps): void;
    unregister(name: string): void;
    register_models(models: {
        [key: string]: unknown;
    } | null | undefined, force?: boolean, errorFn?: (name: string) => void): void;
    registered_names(): string[];
}
export declare const Models: Models;
export declare const register_models: (models: {
    [key: string]: unknown;
} | null | undefined, force?: boolean | undefined, errorFn?: ((name: string) => void) | undefined) => void;
