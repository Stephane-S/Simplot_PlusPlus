import { ZoomBaseTool, ZoomBaseToolView } from "./zoom_base_tool";
import { bk_tool_icon_zoom_in } from "../../../styles/icons";
export class ZoomInTool extends ZoomBaseTool {
    constructor(attrs) {
        super(attrs);
        this.sign = 1;
        this.tool_name = "Zoom In";
        this.icon = bk_tool_icon_zoom_in;
    }
    static init_ZoomInTool() {
        this.prototype.default_view = ZoomBaseToolView;
        this.register_alias("zoom_in", () => new ZoomInTool({ dimensions: 'both' }));
        this.register_alias("xzoom_in", () => new ZoomInTool({ dimensions: 'width' }));
        this.register_alias("yzoom_in", () => new ZoomInTool({ dimensions: 'height' }));
    }
}
ZoomInTool.__name__ = "ZoomInTool";
ZoomInTool.init_ZoomInTool();
//# sourceMappingURL=zoom_in_tool.js.map