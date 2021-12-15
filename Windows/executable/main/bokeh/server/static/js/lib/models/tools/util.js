import { includes } from "../../core/util/array";
export function compute_renderers(renderers, all_renderers, names) {
    if (renderers == null)
        return [];
    let result = renderers == 'auto' ? all_renderers : renderers;
    if (names.length > 0)
        result = result.filter((r) => includes(names, r.name));
    return result;
}
//# sourceMappingURL=util.js.map