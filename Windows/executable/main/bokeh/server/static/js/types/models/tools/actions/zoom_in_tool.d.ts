import { ZoomBaseTool, ZoomBaseToolView } from "./zoom_base_tool";
export interface ZoomInTool extends ZoomBaseTool.Attrs {
}
export declare class ZoomInTool extends ZoomBaseTool {
    properties: ZoomBaseTool.Props;
    __view_type__: ZoomBaseToolView;
    constructor(attrs?: Partial<ZoomBaseTool.Attrs>);
    static init_ZoomInTool(): void;
    sign: number;
    tool_name: string;
    icon: string;
}
