import * as p from "../../core/properties";
import { Tool } from "./tool";
import { GestureTool } from "./gestures/gesture_tool";
import { ToolbarBase } from "./toolbar_base";
export declare type Drag = Tool;
export declare type Inspection = Tool;
export declare type Scroll = Tool;
export declare type Tap = Tool;
declare type ActiveGestureToolsProps = {
    active_drag: p.Property<Drag | "auto" | null>;
    active_scroll: p.Property<Scroll | "auto" | null>;
    active_tap: p.Property<Tap | "auto" | null>;
    active_multi: p.Property<GestureTool | null>;
};
declare type ActiveToolsProps = ActiveGestureToolsProps & {
    active_inspect: p.Property<Inspection | Inspection[] | "auto" | null>;
};
export declare namespace Toolbar {
    type Attrs = p.AttrsOf<Props>;
    type Props = ToolbarBase.Props & ActiveToolsProps;
}
export interface Toolbar extends Toolbar.Attrs {
}
export declare class Toolbar extends ToolbarBase {
    properties: Toolbar.Props;
    constructor(attrs?: Partial<Toolbar.Attrs>);
    static init_Toolbar(): void;
    connect_signals(): void;
    protected _init_tools(): void;
}
export {};
