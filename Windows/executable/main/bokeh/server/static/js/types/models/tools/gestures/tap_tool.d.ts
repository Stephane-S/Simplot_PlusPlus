import { SelectTool, SelectToolView } from "./select_tool";
import { CallbackLike1 } from "../../callbacks/callback";
import * as p from "../../../core/properties";
import { TapEvent } from "../../../core/ui_events";
import { PointGeometry } from "../../../core/geometry";
import { TapBehavior, SelectionMode } from "../../../core/enums";
import { ColumnarDataSource } from "../../sources/columnar_data_source";
export declare class TapToolView extends SelectToolView {
    model: TapTool;
    _tap(ev: TapEvent): void;
    _select(geometry: PointGeometry, final: boolean, mode: SelectionMode): void;
}
export declare namespace TapTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = SelectTool.Props & {
        behavior: p.Property<TapBehavior>;
        callback: p.Property<CallbackLike1<TapTool, {
            geometries: PointGeometry & {
                x: number;
                y: number;
            };
            source: ColumnarDataSource;
        }> | null>;
    };
}
export interface TapTool extends TapTool.Attrs {
}
export declare class TapTool extends SelectTool {
    properties: TapTool.Props;
    __view_type__: TapToolView;
    constructor(attrs?: Partial<TapTool.Attrs>);
    static init_TapTool(): void;
    tool_name: string;
    icon: string;
    event_type: "tap";
    default_order: number;
}
