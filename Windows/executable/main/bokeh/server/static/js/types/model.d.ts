import { HasProps } from "./core/has_props";
import { Class } from "./core/class";
import { ModelEvent } from "./core/bokeh_events";
import * as p from "./core/properties";
import { CallbackLike0 } from "./models/callbacks/callback";
export declare namespace Model {
    type Attrs = p.AttrsOf<Props>;
    type Props = HasProps.Props & {
        tags: p.Property<string[]>;
        name: p.Property<string | null>;
        js_property_callbacks: p.Property<{
            [key: string]: CallbackLike0<Model>[];
        }>;
        js_event_callbacks: p.Property<{
            [key: string]: CallbackLike0<ModelEvent>[];
        }>;
        subscribed_events: p.Property<string[]>;
    };
}
export interface Model extends Model.Attrs {
}
export declare class Model extends HasProps {
    properties: Model.Props;
    private _js_callbacks;
    constructor(attrs?: Partial<Model.Attrs>);
    static init_Model(): void;
    initialize(): void;
    connect_signals(): void;
    _process_event(event: ModelEvent): void;
    trigger_event(event: ModelEvent): void;
    protected _update_event_callbacks(): void;
    protected _update_property_callbacks(): void;
    protected _doc_attached(): void;
    protected _doc_detached(): void;
    select<T extends HasProps>(selector: Class<T> | string): T[];
    select_one<T extends HasProps>(selector: Class<T> | string): T | null;
}
