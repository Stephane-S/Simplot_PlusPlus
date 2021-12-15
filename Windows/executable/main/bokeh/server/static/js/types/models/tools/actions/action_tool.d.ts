import { ButtonTool, ButtonToolView, ButtonToolButtonView } from "../button_tool";
import { Signal } from "../../../core/signaling";
import * as p from "../../../core/properties";
export declare class ActionToolButtonView extends ButtonToolButtonView {
    model: ActionTool;
    protected _clicked(): void;
}
export declare abstract class ActionToolView extends ButtonToolView {
    model: ActionTool;
    connect_signals(): void;
    abstract doit(arg?: unknown): void;
}
export declare namespace ActionTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ButtonTool.Props;
}
export interface ActionTool extends ActionTool.Attrs {
}
export declare abstract class ActionTool extends ButtonTool {
    properties: ActionTool.Props;
    __view_type__: ActionToolView;
    constructor(attrs?: Partial<ActionTool.Attrs>);
    button_view: typeof ActionToolButtonView;
    do: Signal<string | undefined, this>;
}
