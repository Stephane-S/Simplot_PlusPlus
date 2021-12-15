import { HasProps } from "./has_props";
import { Selection } from "../models/selections/selection";
import { GlyphRendererView } from "../models/renderers/glyph_renderer";
import { GraphRendererView } from "../models/renderers/graph_renderer";
import * as p from "./properties";
export class SelectionManager extends HasProps {
    constructor(attrs) {
        super(attrs);
        this.inspectors = new Map();
    }
    static init_SelectionManager() {
        this.internal({
            source: [p.Any],
        });
    }
    select(renderer_views, geometry, final, mode = "replace") {
        // divide renderers into glyph_renderers or graph_renderers
        const glyph_renderer_views = [];
        const graph_renderer_views = [];
        for (const r of renderer_views) {
            if (r instanceof GlyphRendererView)
                glyph_renderer_views.push(r);
            else if (r instanceof GraphRendererView)
                graph_renderer_views.push(r);
        }
        let did_hit = false;
        // graph renderer case
        for (const r of graph_renderer_views) {
            const hit_test_result = r.model.selection_policy.hit_test(geometry, r);
            did_hit = did_hit || r.model.selection_policy.do_selection(hit_test_result, r.model, final, mode);
        }
        // glyph renderers
        if (glyph_renderer_views.length > 0) {
            const hit_test_result = this.source.selection_policy.hit_test(geometry, glyph_renderer_views);
            did_hit = did_hit || this.source.selection_policy.do_selection(hit_test_result, this.source, final, mode);
        }
        return did_hit;
    }
    inspect(renderer_view, geometry) {
        let did_hit = false;
        if (renderer_view instanceof GlyphRendererView) {
            const hit_test_result = renderer_view.hit_test(geometry);
            if (hit_test_result != null) {
                did_hit = !hit_test_result.is_empty();
                const inspection = this.get_or_create_inspector(renderer_view.model);
                inspection.update(hit_test_result, true, "replace");
                this.source.setv({ inspected: inspection }, { silent: true });
                this.source.inspect.emit([renderer_view, { geometry }]);
            }
        }
        else if (renderer_view instanceof GraphRendererView) {
            const hit_test_result = renderer_view.model.inspection_policy.hit_test(geometry, renderer_view);
            did_hit = did_hit || renderer_view.model.inspection_policy.do_inspection(hit_test_result, geometry, renderer_view, false, "replace");
        }
        return did_hit;
    }
    clear(rview) {
        this.source.selected.clear();
        if (rview != null)
            this.get_or_create_inspector(rview.model).clear();
    }
    get_or_create_inspector(renderer) {
        let selection = this.inspectors.get(renderer);
        if (selection == null) {
            selection = new Selection();
            this.inspectors.set(renderer, selection);
        }
        return selection;
    }
}
SelectionManager.__name__ = "SelectionManager";
SelectionManager.init_SelectionManager();
//# sourceMappingURL=selection_manager.js.map