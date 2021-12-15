import { ActionTool, ActionToolView } from "./action_tool";
import * as p from "../../../core/properties";
import { MenuItem } from "../../../core/util/menus";
export declare class SaveToolView extends ActionToolView {
    model: SaveTool;
    copy(): Promise<void>;
    save(name: string): Promise<void>;
    doit(action?: "save" | "copy"): void;
}
export declare namespace SaveTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ActionTool.Props;
}
export interface SaveTool extends SaveTool.Attrs {
}
export declare class SaveTool extends ActionTool {
    properties: SaveTool.Props;
    __view_type__: SaveToolView;
    constructor(attrs?: Partial<SaveTool.Attrs>);
    static init_SaveTool(): void;
    tool_name: string;
    icon: string;
    get menu(): MenuItem[] | null;
}
