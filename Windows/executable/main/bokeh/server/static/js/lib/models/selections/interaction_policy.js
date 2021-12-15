import { Model } from "../../model";
export class SelectionPolicy extends Model {
    do_selection(hit_test_result, source, final, mode) {
        if (hit_test_result === null) {
            return false;
        }
        else {
            source.selected.update(hit_test_result, final, mode);
            source._select.emit();
            return !source.selected.is_empty();
        }
    }
}
SelectionPolicy.__name__ = "SelectionPolicy";
export class IntersectRenderers extends SelectionPolicy {
    hit_test(geometry, renderer_views) {
        const hit_test_result_renderers = [];
        for (const r of renderer_views) {
            const result = r.hit_test(geometry);
            if (result !== null)
                hit_test_result_renderers.push(result);
        }
        if (hit_test_result_renderers.length > 0) {
            const hit_test_result = hit_test_result_renderers[0];
            for (const hit_test_result_other of hit_test_result_renderers) {
                hit_test_result.update_through_intersection(hit_test_result_other);
            }
            return hit_test_result;
        }
        else {
            return null;
        }
    }
}
IntersectRenderers.__name__ = "IntersectRenderers";
export class UnionRenderers extends SelectionPolicy {
    hit_test(geometry, renderer_views) {
        const hit_test_result_renderers = [];
        for (const r of renderer_views) {
            const result = r.hit_test(geometry);
            if (result !== null)
                hit_test_result_renderers.push(result);
        }
        if (hit_test_result_renderers.length > 0) {
            const hit_test_result = hit_test_result_renderers[0];
            for (const hit_test_result_other of hit_test_result_renderers) {
                hit_test_result.update_through_union(hit_test_result_other);
            }
            return hit_test_result;
        }
        else {
            return null;
        }
    }
}
UnionRenderers.__name__ = "UnionRenderers";
//# sourceMappingURL=interaction_policy.js.map