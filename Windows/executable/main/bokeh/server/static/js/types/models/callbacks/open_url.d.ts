import { Callback } from "./callback";
import { ColumnarDataSource } from "../sources/columnar_data_source";
import * as p from "../../core/properties";
export declare namespace OpenURL {
    type Attrs = p.AttrsOf<Props>;
    type Props = Callback.Props & {
        url: p.Property<string>;
        same_tab: p.Property<boolean>;
    };
}
export interface OpenURL extends OpenURL.Attrs {
}
export declare class OpenURL extends Callback {
    properties: OpenURL.Props;
    constructor(attrs?: Partial<OpenURL.Attrs>);
    static init_OpenURL(): void;
    execute(_cb_obj: unknown, { source }: {
        source: ColumnarDataSource;
    }): void;
}
