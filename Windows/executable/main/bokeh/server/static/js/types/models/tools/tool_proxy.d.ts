import * as p from "../../core/properties";
import { EventType } from "../../core/ui_events";
import { Signal0 } from "../../core/signaling";
import { Class } from "../../core/class";
import { Model } from "../../model";
import { ButtonTool, ButtonToolButtonView } from "./button_tool";
import { MenuItem } from "../../core/util/menus";
export declare namespace ToolProxy {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        tools: p.Property<ButtonTool[]>;
        active: p.Property<boolean>;
        disabled: p.Property<boolean>;
    };
}
export interface ToolProxy extends ToolProxy.Attrs {
}
export declare class ToolProxy extends Model {
    properties: ToolProxy.Props;
    constructor(attrs?: Partial<ToolProxy.Attrs>);
    static init_ToolProxy(): void;
    do: Signal0<this>;
    get button_view(): Class<ButtonToolButtonView>;
    get event_type(): undefined | EventType | EventType[];
    get tooltip(): string;
    get tool_name(): string;
    get icon(): string;
    get computed_icon(): string;
    get toggleable(): boolean;
    initialize(): void;
    connect_signals(): void;
    doit(): void;
    set_active(): void;
    get menu(): MenuItem[] | null;
}
