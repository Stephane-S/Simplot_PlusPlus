import { Document } from "../document";
import { View } from "../core/view";
export declare const index: {
    [key: string]: View;
};
export declare function add_document_standalone(document: Document, element: HTMLElement, roots?: (HTMLElement | null)[], use_for_title?: boolean): Promise<View[]>;
