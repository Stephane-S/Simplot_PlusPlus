import { RootAddedEvent, RootRemovedEvent, TitleChangedEvent } from "../document";
import { DOMView } from "../core/dom_view";
import { build_view } from "../core/build_views";
import { div } from "../core/dom";
import { BOKEH_ROOT } from "./dom";
// A map from the root model IDs to their views.
export const index = {};
export async function add_document_standalone(document, element, roots = [], use_for_title = false) {
    // this is a LOCAL index of views used only by this particular rendering
    // call, so we can remove the views we create.
    const views = new Map();
    async function render_model(model) {
        let root_el;
        const root_models = document.roots();
        const idx = root_models.indexOf(model);
        const root = roots[idx];
        if (root != null)
            root_el = root;
        else if (element.classList.contains(BOKEH_ROOT))
            root_el = element;
        else {
            root_el = div({ class: BOKEH_ROOT });
            element.appendChild(root_el);
        }
        const view = await build_view(model, { parent: null });
        if (view instanceof DOMView)
            view.renderTo(root_el);
        views.set(model, view);
        index[model.id] = view;
        return view;
    }
    function unrender_model(model) {
        const view = views.get(model);
        if (view != null) {
            view.remove();
            views.delete(model);
            delete index[model.id];
        }
    }
    for (const model of document.roots())
        await render_model(model);
    if (use_for_title)
        window.document.title = document.title();
    document.on_change((event) => {
        if (event instanceof RootAddedEvent)
            render_model(event.model);
        else if (event instanceof RootRemovedEvent)
            unrender_model(event.model);
        else if (use_for_title && event instanceof TitleChangedEvent)
            window.document.title = event.title;
    });
    return [...views.values()];
}
//# sourceMappingURL=standalone.js.map