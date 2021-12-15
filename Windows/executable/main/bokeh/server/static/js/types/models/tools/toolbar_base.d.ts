import * as p from "../../core/properties";
import { DOMView } from "../../core/dom_view";
import { Logo, Location } from "../../core/enums";
import { Model } from "../../model";
import { Tool } from "./tool";
import { ButtonTool, ButtonToolButtonView } from "./button_tool";
import { GestureTool } from "./gestures/gesture_tool";
import { ActionTool } from "./actions/action_tool";
import { HelpTool } from "./actions/help_tool";
import { ToolProxy } from "./tool_proxy";
import { InspectTool } from "./inspectors/inspect_tool";
export declare namespace ToolbarViewModel {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        _visible: p.Property<boolean | null>;
        autohide: p.Property<boolean>;
    };
}
export interface ToolbarViewModel extends ToolbarViewModel.Attrs {
}
export declare class ToolbarViewModel extends Model {
    properties: ToolbarViewModel.Props;
    constructor(attrs?: Partial<ToolbarViewModel.Attrs>);
    static init_ToolbarViewModel(): void;
    get visible(): boolean;
}
export declare class ToolbarBaseView extends DOMView {
    model: ToolbarBase;
    protected _tool_button_views: Map<ButtonTool, ButtonToolButtonView>;
    protected _toolbar_view_model: ToolbarViewModel;
    initialize(): void;
    lazy_initialize(): Promise<void>;
    connect_signals(): void;
    styles(): string[];
    remove(): void;
    protected _build_tool_button_views(): Promise<void>;
    set_visibility(visible: boolean): void;
    protected _on_visible_change(): void;
    render(): void;
    update_layout(): void;
    update_position(): void;
    after_layout(): void;
}
export declare type GesturesMap = {
    pan: {
        tools: GestureTool[];
        active: Tool | null;
    };
    scroll: {
        tools: GestureTool[];
        active: Tool | null;
    };
    pinch: {
        tools: GestureTool[];
        active: Tool | null;
    };
    tap: {
        tools: GestureTool[];
        active: Tool | null;
    };
    doubletap: {
        tools: GestureTool[];
        active: Tool | null;
    };
    press: {
        tools: GestureTool[];
        active: Tool | null;
    };
    pressup: {
        tools: GestureTool[];
        active: Tool | null;
    };
    rotate: {
        tools: GestureTool[];
        active: Tool | null;
    };
    move: {
        tools: GestureTool[];
        active: Tool | null;
    };
    multi: {
        tools: GestureTool[];
        active: Tool | null;
    };
};
export declare type GestureType = keyof GesturesMap;
export declare namespace ToolbarBase {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        tools: p.Property<Tool[]>;
        logo: p.Property<Logo>;
        gestures: p.Property<GesturesMap>;
        actions: p.Property<ActionTool[]>;
        inspectors: p.Property<InspectTool[]>;
        help: p.Property<HelpTool[]>;
        toolbar_location: p.Property<Location>;
        autohide: p.Property<boolean>;
    };
}
export interface ToolbarBase extends ToolbarBase.Attrs {
}
export declare class ToolbarBase extends Model {
    properties: ToolbarBase.Props;
    constructor(attrs?: Partial<ToolbarBase.Attrs>);
    static init_ToolbarBase(): void;
    _proxied_tools?: (Tool | ToolProxy)[];
    initialize(): void;
    protected _init_tools(): void;
    get horizontal(): boolean;
    get vertical(): boolean;
    _active_change(tool: Tool): void;
}
