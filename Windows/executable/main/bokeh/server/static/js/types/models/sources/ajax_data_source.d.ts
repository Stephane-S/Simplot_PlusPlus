import { WebDataSource } from "./web_data_source";
import { UpdateMode, HTTPMethod } from "../../core/enums";
import * as p from "../../core/properties";
export declare namespace AjaxDataSource {
    type Attrs = p.AttrsOf<Props>;
    type Props = WebDataSource.Props & {
        polling_interval: p.Property<number>;
        content_type: p.Property<string>;
        http_headers: p.Property<{
            [key: string]: string;
        }>;
        method: p.Property<HTTPMethod>;
        if_modified: p.Property<boolean>;
    };
}
export interface AjaxDataSource extends AjaxDataSource.Attrs {
}
export declare class AjaxDataSource extends WebDataSource {
    properties: AjaxDataSource.Props;
    constructor(attrs?: Partial<AjaxDataSource.Attrs>);
    static init_AjaxDataSource(): void;
    protected interval: number;
    protected initialized: boolean;
    destroy(): void;
    setup(): void;
    get_data(mode: UpdateMode, max_size?: number, _if_modified?: boolean): void;
    prepare_request(): XMLHttpRequest;
    do_load(xhr: XMLHttpRequest, mode: UpdateMode, max_size: number): void;
    do_error(xhr: XMLHttpRequest): void;
}
