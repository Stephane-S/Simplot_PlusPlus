import { ActionTool, ActionToolView } from "./action_tool";
import * as p from "../../../core/properties";
export declare class UndoToolView extends ActionToolView {
    model: UndoTool;
    connect_signals(): void;
    doit(): void;
}
export declare namespace UndoTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ActionTool.Props;
}
export interface UndoTool extends UndoTool.Attrs {
}
export declare class UndoTool extends ActionTool {
    properties: UndoTool.Props;
    __view_type__: UndoToolView;
    constructor(attrs?: Partial<UndoTool.Attrs>);
    static init_UndoTool(): void;
    tool_name: string;
    icon: string;
}
