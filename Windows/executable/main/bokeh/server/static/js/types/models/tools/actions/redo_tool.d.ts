import { ActionTool, ActionToolView } from "./action_tool";
import * as p from "../../../core/properties";
export declare class RedoToolView extends ActionToolView {
    model: RedoTool;
    connect_signals(): void;
    doit(): void;
}
export declare namespace RedoTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ActionTool.Props;
}
export interface RedoTool extends RedoTool.Attrs {
}
export declare class RedoTool extends ActionTool {
    properties: RedoTool.Props;
    __view_type__: RedoToolView;
    constructor(attrs?: Partial<RedoTool.Attrs>);
    static init_RedoTool(): void;
    tool_name: string;
    icon: string;
}
