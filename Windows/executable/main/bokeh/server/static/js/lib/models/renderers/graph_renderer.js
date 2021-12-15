import { DataRenderer, DataRendererView } from "./data_renderer";
import { NodesOnly } from "../graphs/graph_hit_test_policy";
import * as p from "../../core/properties";
import { build_view } from "../../core/build_views";
import { assert } from "../../core/util/assert";
export class GraphRendererView extends DataRendererView {
    async lazy_initialize() {
        await super.lazy_initialize();
        const graph = this.model;
        // TODO: replace this with bi-variate transforms
        let xs_ys = null;
        let x_y = null;
        const xs_expr = {
            v_compute(source) {
                assert(xs_ys == null);
                const [xs] = xs_ys = graph.layout_provider.get_edge_coordinates(source);
                return xs;
            },
        };
        const ys_expr = {
            v_compute(_source) {
                assert(xs_ys != null);
                const [, ys] = xs_ys;
                xs_ys = null;
                return ys;
            },
        };
        const x_expr = {
            v_compute(source) {
                assert(x_y == null);
                const [x] = x_y = graph.layout_provider.get_node_coordinates(source);
                return x;
            },
        };
        const y_expr = {
            v_compute(_source) {
                assert(x_y != null);
                const [, y] = x_y;
                x_y = null;
                return y;
            },
        };
        const { edge_renderer, node_renderer } = this.model;
        edge_renderer.glyph.properties.xs.internal = true;
        edge_renderer.glyph.properties.ys.internal = true;
        node_renderer.glyph.properties.x.internal = true;
        node_renderer.glyph.properties.y.internal = true;
        edge_renderer.glyph.xs = { expr: xs_expr };
        edge_renderer.glyph.ys = { expr: ys_expr };
        node_renderer.glyph.x = { expr: x_expr };
        node_renderer.glyph.y = { expr: y_expr };
        const { parent } = this;
        this.edge_view = await build_view(edge_renderer, { parent });
        this.node_view = await build_view(node_renderer, { parent });
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.layout_provider.change, () => {
            this.edge_view.set_data(false);
            this.node_view.set_data(false);
            this.request_render();
        });
    }
    remove() {
        this.edge_view.remove();
        this.node_view.remove();
        super.remove();
    }
    _render() {
        this.edge_view.render();
        this.node_view.render();
    }
}
GraphRendererView.__name__ = "GraphRendererView";
export class GraphRenderer extends DataRenderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_GraphRenderer() {
        this.prototype.default_view = GraphRendererView;
        this.define({
            layout_provider: [p.Instance],
            node_renderer: [p.Instance],
            edge_renderer: [p.Instance],
            selection_policy: [p.Instance, () => new NodesOnly()],
            inspection_policy: [p.Instance, () => new NodesOnly()],
        });
    }
    get_selection_manager() {
        return this.node_renderer.data_source.selection_manager;
    }
}
GraphRenderer.__name__ = "GraphRenderer";
GraphRenderer.init_GraphRenderer();
//# sourceMappingURL=graph_renderer.js.map