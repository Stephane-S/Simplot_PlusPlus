import { DataRenderer, DataRendererView } from "./data_renderer";
import { GlyphRenderer, GlyphRendererView } from "./glyph_renderer";
import { LayoutProvider } from "../graphs/layout_provider";
import { GraphHitTestPolicy } from "../graphs/graph_hit_test_policy";
import * as p from "../../core/properties";
import { SelectionManager } from "../../core/selection_manager";
import { XYGlyph } from "../glyphs/xy_glyph";
import { MultiLine } from "../glyphs/multi_line";
export declare class GraphRendererView extends DataRendererView {
    model: GraphRenderer;
    edge_view: GlyphRendererView;
    node_view: GlyphRendererView;
    lazy_initialize(): Promise<void>;
    connect_signals(): void;
    remove(): void;
    protected _render(): void;
}
export declare namespace GraphRenderer {
    type Attrs = p.AttrsOf<Props>;
    type Props = DataRenderer.Props & {
        layout_provider: p.Property<LayoutProvider>;
        node_renderer: p.Property<GlyphRenderer & {
            glyph: XYGlyph;
        }>;
        edge_renderer: p.Property<GlyphRenderer & {
            glyph: MultiLine;
        }>;
        selection_policy: p.Property<GraphHitTestPolicy>;
        inspection_policy: p.Property<GraphHitTestPolicy>;
    };
}
export interface GraphRenderer extends GraphRenderer.Attrs {
}
export declare class GraphRenderer extends DataRenderer {
    properties: GraphRenderer.Props;
    __view_type__: GraphRendererView;
    constructor(attrs?: Partial<GraphRenderer.Attrs>);
    static init_GraphRenderer(): void;
    get_selection_manager(): SelectionManager;
}
