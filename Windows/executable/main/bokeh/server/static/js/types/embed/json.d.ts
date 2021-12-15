import { DocJson } from "../document";
export declare type DocsJson = {
    [key: string]: DocJson;
};
export interface RenderItem {
    docid?: string;
    token?: string;
    elementid?: string;
    roots?: {
        [key: string]: string;
    };
    root_ids?: string[];
    use_for_title?: boolean;
    notebook_comms_target?: any;
}
