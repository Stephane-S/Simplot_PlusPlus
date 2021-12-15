import { UIEvent, PanEvent, TapEvent, MoveEvent, KeyEvent } from "../../../core/ui_events";
import * as p from "../../../core/properties";
import { MultiLine } from "../../glyphs/multi_line";
import { Patches } from "../../glyphs/patches";
import { PolyTool, PolyToolView } from "./poly_tool";
export interface HasPolyGlyph {
    glyph: MultiLine | Patches;
}
export declare class PolyDrawToolView extends PolyToolView {
    model: PolyDrawTool;
    _drawing: boolean;
    _initialized: boolean;
    _tap(ev: TapEvent): void;
    _draw(ev: UIEvent, mode: string, emit?: boolean): void;
    _show_vertices(): void;
    _doubletap(ev: TapEvent): void;
    _move(ev: MoveEvent): void;
    _remove(): void;
    _keyup(ev: KeyEvent): void;
    _pan_start(ev: PanEvent): void;
    _pan(ev: PanEvent): void;
    _pan_end(ev: PanEvent): void;
    activate(): void;
    deactivate(): void;
}
export declare namespace PolyDrawTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = PolyTool.Props & {
        drag: p.Property<boolean>;
        num_objects: p.Property<number>;
    };
}
export interface PolyDrawTool extends PolyDrawTool.Attrs {
}
export declare class PolyDrawTool extends PolyTool {
    properties: PolyDrawTool.Props;
    __view_type__: PolyDrawToolView;
    constructor(attrs?: Partial<PolyDrawTool.Attrs>);
    static init_PolyDrawTool(): void;
    tool_name: string;
    icon: string;
    event_type: ("pan" | "tap" | "move")[];
    default_order: number;
}
