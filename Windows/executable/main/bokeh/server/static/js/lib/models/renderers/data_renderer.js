import { Renderer, RendererView } from "./renderer";
export class DataRendererView extends RendererView {
    get xscale() {
        return this.coordinates.x_scale;
    }
    get yscale() {
        return this.coordinates.y_scale;
    }
}
DataRendererView.__name__ = "DataRendererView";
export class DataRenderer extends Renderer {
    constructor(attrs) {
        super(attrs);
    }
    static init_DataRenderer() {
        this.override({
            level: 'glyph',
        });
    }
}
DataRenderer.__name__ = "DataRenderer";
DataRenderer.init_DataRenderer();
//# sourceMappingURL=data_renderer.js.map