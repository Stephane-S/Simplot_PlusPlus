import { Renderer, RendererView } from "./renderer";
import { Scale } from "../scales/scale";
import { SelectionManager } from "../../core/selection_manager";
import * as p from "../../core/properties";
export declare abstract class DataRendererView extends RendererView {
    model: DataRenderer;
    visuals: DataRenderer.Visuals;
    get xscale(): Scale;
    get yscale(): Scale;
}
export declare namespace DataRenderer {
    type Attrs = p.AttrsOf<Props>;
    type Props = Renderer.Props;
    type Visuals = Renderer.Visuals;
}
export interface DataRenderer extends DataRenderer.Attrs {
}
export declare abstract class DataRenderer extends Renderer {
    properties: DataRenderer.Props;
    __view_type__: DataRendererView;
    constructor(attrs?: Partial<DataRenderer.Attrs>);
    static init_DataRenderer(): void;
    abstract get_selection_manager(): SelectionManager;
}
