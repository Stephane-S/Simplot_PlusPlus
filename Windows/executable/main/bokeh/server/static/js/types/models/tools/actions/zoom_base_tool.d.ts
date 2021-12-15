import { ActionTool, ActionToolView } from "./action_tool";
import { Dimensions } from "../../../core/enums";
import * as p from "../../../core/properties";
export declare class ZoomBaseToolView extends ActionToolView {
    model: ZoomBaseTool;
    doit(): void;
}
export declare namespace ZoomBaseTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ActionTool.Props & {
        factor: p.Property<number>;
        dimensions: p.Property<Dimensions>;
    };
}
export interface ZoomBaseTool extends ZoomBaseTool.Attrs {
}
export declare class ZoomBaseTool extends ActionTool {
    properties: ZoomBaseTool.Props;
    __view_type__: ZoomBaseToolView;
    constructor(attrs?: Partial<ZoomBaseTool.Attrs>);
    static init_ZoomBaseTool(): void;
    sign: number;
    tool_name: string;
    icon: string;
    get tooltip(): string;
}
