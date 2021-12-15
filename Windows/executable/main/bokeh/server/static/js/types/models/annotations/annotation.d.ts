import { SidePanel } from "../../core/layout/side_panel";
import { Size } from "../../core/layout";
import { Renderer, RendererView } from "../renderers/renderer";
import { ColumnarDataSource } from "../sources/columnar_data_source";
export declare abstract class AnnotationView extends RendererView {
    model: Annotation;
    layout: SidePanel;
    get panel(): SidePanel | undefined;
    connect_signals(): void;
    get_size(): Size;
    protected _get_size(): Size;
    set_data(source: ColumnarDataSource): void;
    get needs_clip(): boolean;
    serializable_state(): {
        [key: string]: unknown;
    };
}
export declare namespace Annotation {
    type Attrs = Renderer.Attrs;
    type Props = Renderer.Props;
    type Visuals = Renderer.Visuals;
}
export interface Annotation extends Annotation.Attrs {
}
export declare abstract class Annotation extends Renderer {
    properties: Annotation.Props;
    __view_type__: AnnotationView;
    constructor(attrs?: Partial<Annotation.Attrs>);
    static init_Annotation(): void;
}
