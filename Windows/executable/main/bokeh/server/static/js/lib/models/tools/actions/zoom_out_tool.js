import { ZoomBaseTool, ZoomBaseToolView } from "./zoom_base_tool";
import { bk_tool_icon_zoom_out } from "../../../styles/icons";
export class ZoomOutTool extends ZoomBaseTool {
    constructor(attrs) {
        super(attrs);
        this.sign = -1;
        this.tool_name = "Zoom Out";
        this.icon = bk_tool_icon_zoom_out;
    }
    static init_ZoomOutTool() {
        this.prototype.default_view = ZoomBaseToolView;
        this.register_alias("zoom_out", () => new ZoomOutTool({ dimensions: 'both' }));
        this.register_alias("xzoom_out", () => new ZoomOutTool({ dimensions: 'width' }));
        this.register_alias("yzoom_out", () => new ZoomOutTool({ dimensions: 'height' }));
    }
}
ZoomOutTool.__name__ = "ZoomOutTool";
ZoomOutTool.init_ZoomOutTool();
//# sourceMappingURL=zoom_out_tool.js.map