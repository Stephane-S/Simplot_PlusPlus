import { Class } from "../../core/class";
import { DOMView } from "../../core/dom_view";
import { Tool, ToolView } from "./tool";
import * as p from "../../core/properties";
import { MenuItem } from "../../core/util/menus";
import type { ToolbarBaseView } from "./toolbar_base";
export declare abstract class ButtonToolButtonView extends DOMView {
    model: ButtonTool;
    parent: ToolbarBaseView;
    private _hammer;
    private _menu?;
    initialize(): void;
    remove(): void;
    styles(): string[];
    css_classes(): string[];
    render(): void;
    protected abstract _clicked(): void;
    protected _pressed(): void;
}
export declare abstract class ButtonToolView extends ToolView {
    model: ButtonTool;
}
export declare namespace ButtonTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = Tool.Props & {
        disabled: p.Property<boolean>;
    };
}
export interface ButtonTool extends ButtonTool.Attrs {
}
export declare abstract class ButtonTool extends Tool {
    properties: ButtonTool.Props;
    __view_type__: ButtonToolView;
    constructor(attrs?: Partial<ButtonTool.Attrs>);
    static init_ButtonTool(): void;
    tool_name: string;
    icon: string;
    button_view: Class<ButtonToolButtonView>;
    get tooltip(): string;
    get computed_icon(): string;
    get menu(): MenuItem[] | null;
}
