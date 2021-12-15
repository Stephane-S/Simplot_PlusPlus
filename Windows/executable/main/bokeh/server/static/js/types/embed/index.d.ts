import { DocJson } from "../document";
import { View } from "../core/view";
import { DocsJson, RenderItem } from "./json";
export { DocsJson, RenderItem } from "./json";
export { add_document_standalone, index } from "./standalone";
export { add_document_from_session } from "./server";
export { embed_items_notebook, kernels } from "./notebook";
export { BOKEH_ROOT } from "./dom";
export declare type JsonItem = {
    doc: DocJson;
    root_id: string;
    target_id: string;
};
export declare function embed_item(item: JsonItem, target_id?: string): Promise<View[]>;
export declare function embed_items(docs_json: string | DocsJson, render_items: RenderItem[], app_path?: string, absolute_url?: string): Promise<View[][]>;
