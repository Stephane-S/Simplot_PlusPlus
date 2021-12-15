import { Renderer, RendererView } from "./renderer";
export class GuideRendererView extends RendererView {
}
GuideRendererView.__name__ = "GuideRendererView";
export class GuideRenderer extends Renderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_GuideRenderer() {
        this.override({
            level: "guide",
        });
    }
}
GuideRenderer.__name__ = "GuideRenderer";
GuideRenderer.init_GuideRenderer();
//# sourceMappingURL=guide_renderer.js.map