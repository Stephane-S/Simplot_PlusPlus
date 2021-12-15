import { ActionTool, ActionToolView, ActionToolButtonView } from "./action_tool";
import { CallbackLike0 } from "../../callbacks/callback";
import * as p from "../../../core/properties";
export declare class CustomActionButtonView extends ActionToolButtonView {
    model: CustomAction;
    css_classes(): string[];
}
export declare class CustomActionView extends ActionToolView {
    model: CustomAction;
    doit(): void;
}
export declare namespace CustomAction {
    type Attrs = p.AttrsOf<Props>;
    type Props = ActionTool.Props & {
        action_tooltip: p.Property<string>;
        callback: p.Property<CallbackLike0<CustomAction> | null>;
        icon: p.Property<string>;
    };
}
export interface CustomAction extends CustomAction.Attrs {
}
export declare class CustomAction extends ActionTool {
    properties: CustomAction.Props;
    __view_type__: CustomActionView;
    constructor(attrs?: Partial<CustomAction.Attrs>);
    static init_CustomAction(): void;
    tool_name: string;
    button_view: typeof CustomActionButtonView;
    get tooltip(): string;
}
