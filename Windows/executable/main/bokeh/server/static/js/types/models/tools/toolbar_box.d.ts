import * as p from "../../core/properties";
import { Location } from "../../core/enums";
import { Tool } from "./tool";
import { ToolbarBase } from "./toolbar_base";
import { Toolbar } from "./toolbar";
import { ToolProxy } from "./tool_proxy";
import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
export declare namespace ProxyToolbar {
    type Attrs = p.AttrsOf<Props>;
    type Props = ToolbarBase.Props & {
        toolbars: p.Property<Toolbar[]>;
    };
}
export interface ProxyToolbar extends ProxyToolbar.Attrs {
}
export declare class ProxyToolbar extends ToolbarBase {
    properties: ProxyToolbar.Props;
    constructor(attrs?: Partial<ProxyToolbar.Attrs>);
    static init_ProxyToolbar(): void;
    _proxied_tools: (Tool | ToolProxy)[];
    initialize(): void;
    protected _merge_tools(): void;
}
export declare class ToolbarBoxView extends LayoutDOMView {
    model: ToolbarBox;
    initialize(): void;
    get child_models(): LayoutDOM[];
    _update_layout(): void;
}
export declare namespace ToolbarBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props & {
        toolbar: p.Property<ToolbarBase>;
        toolbar_location: p.Property<Location>;
    };
}
export interface ToolbarBox extends ToolbarBox.Attrs {
}
export declare class ToolbarBox extends LayoutDOM {
    properties: ToolbarBox.Props;
    constructor(attrs?: Partial<ToolbarBox.Attrs>);
    static init_ToolbarBox(): void;
}
