import { GestureTool, GestureToolView } from "./gesture_tool";
import { DataRenderer } from "../../renderers/data_renderer";
import { DataSource } from "../../sources/data_source";
import { RendererSpec } from "../util";
import * as p from "../../../core/properties";
import { KeyEvent, UIEvent } from "../../../core/ui_events";
import { SelectionMode } from "../../../core/enums";
import { Geometry } from "../../../core/geometry";
import { Signal0 } from "../../../core/signaling";
import { MenuItem } from "../../../core/util/menus";
export declare abstract class SelectToolView extends GestureToolView {
    model: SelectTool;
    connect_signals(): void;
    get computed_renderers(): DataRenderer[];
    _computed_renderers_by_data_source(): Map<DataSource, DataRenderer[]>;
    protected _select_mode(ev: UIEvent): SelectionMode;
    _keyup(ev: KeyEvent): void;
    _clear(): void;
    _select(geometry: Geometry, final: boolean, mode: SelectionMode): void;
    _emit_selection_event(geometry: Geometry, final?: boolean): void;
}
export declare namespace SelectTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = GestureTool.Props & {
        renderers: p.Property<RendererSpec>;
        names: p.Property<string[]>;
        mode: p.Property<SelectionMode>;
    };
}
export interface SelectTool extends SelectTool.Attrs {
}
export declare abstract class SelectTool extends GestureTool {
    properties: SelectTool.Props;
    __view_type__: SelectToolView;
    clear: Signal0<this>;
    constructor(attrs?: Partial<SelectTool.Attrs>);
    initialize(): void;
    static init_SelectTool(): void;
    get menu(): MenuItem[] | null;
}
