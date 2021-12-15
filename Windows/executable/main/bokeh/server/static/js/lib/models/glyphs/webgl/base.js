export class BaseGLGlyph {
    constructor(gl, glyph) {
        this.gl = gl;
        this.glyph = glyph;
        this.nvertices = 0;
        this.size_changed = false;
        this.data_changed = false;
        this.visuals_changed = false;
        this.init();
    }
    set_data_changed() {
        const { data_size } = this.glyph;
        if (data_size != this.nvertices) {
            this.nvertices = data_size;
            this.size_changed = true;
        }
        this.data_changed = true;
    }
    set_visuals_changed() {
        this.visuals_changed = true;
    }
    render(_ctx, indices, mainglyph) {
        if (indices.length == 0) {
            return true;
        }
        const { width, height } = this.glyph.renderer.plot_view.canvas_view.webgl.canvas;
        const trans = {
            pixel_ratio: this.glyph.renderer.plot_view.canvas_view.pixel_ratio,
            width,
            height,
        };
        this.draw(indices, mainglyph, trans);
        return true;
    }
}
BaseGLGlyph.__name__ = "BaseGLGlyph";
//# sourceMappingURL=base.js.map