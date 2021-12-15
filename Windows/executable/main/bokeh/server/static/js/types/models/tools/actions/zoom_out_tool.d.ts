import { ZoomBaseTool, ZoomBaseToolView } from "./zoom_base_tool";
export interface ZoomOutTool extends ZoomBaseTool.Attrs {
}
export declare class ZoomOutTool extends ZoomBaseTool {
    properties: ZoomBaseTool.Props;
    __view_type__: ZoomBaseToolView;
    constructor(attrs?: Partial<ZoomBaseTool.Attrs>);
    static init_ZoomOutTool(): void;
    sign: number;
    tool_name: string;
    icon: string;
}
