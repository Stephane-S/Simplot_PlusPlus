import { Transform } from "./transform";
import * as p from "../../core/properties";
import { Arrayable } from "../../core/types";
export declare namespace CustomJSTransform {
    type Attrs = p.AttrsOf<Props>;
    type Props = Transform.Props & {
        args: p.Property<{
            [key: string]: unknown;
        }>;
        func: p.Property<string>;
        v_func: p.Property<string>;
    };
}
export interface CustomJSTransform extends CustomJSTransform.Attrs {
}
export declare class CustomJSTransform extends Transform {
    properties: CustomJSTransform.Props;
    constructor(attrs?: Partial<CustomJSTransform.Attrs>);
    static init_CustomJSTransform(): void;
    get names(): string[];
    get values(): any[];
    protected _make_transform(name: string, func: string): Function;
    get scalar_transform(): Function;
    get vector_transform(): Function;
    compute(x: number): number;
    v_compute(xs: Arrayable<number>): Arrayable<number>;
}
