import { Attrs } from "../types";
export interface Struct {
    id: string;
    type: string;
    subtype?: string;
    attributes: Attrs;
}
export interface Ref {
    id: string;
}
export declare function is_ref(arg: unknown): arg is Ref;
