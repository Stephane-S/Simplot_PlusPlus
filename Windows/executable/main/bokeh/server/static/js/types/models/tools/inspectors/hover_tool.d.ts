import { InspectTool, InspectToolView } from "./inspect_tool";
import { CallbackLike1 } from "../../callbacks/callback";
import { Tooltip, TooltipView } from "../../annotations/tooltip";
import { Renderer, RendererView } from "../../renderers/renderer";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { DataRenderer } from "../../renderers/data_renderer";
import { RendererSpec } from "../util";
import { MoveEvent } from "../../../core/ui_events";
import { Formatters, Vars } from "../../../core/util/templating";
import * as p from "../../../core/properties";
import { HoverMode, PointPolicy, LinePolicy, Anchor, TooltipAttachment, MutedPolicy } from "../../../core/enums";
import { Geometry, PointGeometry, SpanGeometry } from "../../../core/geometry";
import { ColumnarDataSource } from "../../sources/columnar_data_source";
import { ImageIndex } from "../../selections/selection";
export declare type TooltipVars = {
    index: number;
} & Vars;
export declare function _nearest_line_hit(i: number, geometry: Geometry, sx: number, sy: number, dx: number[], dy: number[]): [[number, number], number];
export declare function _line_hit(xs: number[], ys: number[], ind: number): [[number, number], number];
export declare class HoverToolView extends InspectToolView {
    model: HoverTool;
    protected _ttviews: Map<Tooltip, TooltipView>;
    protected _ttmodels: Map<GlyphRenderer, Tooltip> | null;
    protected _computed_renderers: DataRenderer[] | null;
    protected _template_el?: HTMLElement;
    initialize(): void;
    remove(): void;
    connect_signals(): void;
    protected _compute_ttmodels(): Map<GlyphRenderer, Tooltip>;
    get computed_renderers(): DataRenderer[];
    get ttmodels(): Map<GlyphRenderer, Tooltip>;
    _clear(): void;
    _move(ev: MoveEvent): void;
    _move_exit(): void;
    _inspect(sx: number, sy: number): void;
    _update([renderer_view, { geometry }]: [RendererView, {
        geometry: PointGeometry | SpanGeometry;
    }]): void;
    _emit_callback(geometry: PointGeometry | SpanGeometry): void;
    _create_template(tooltips: [string, string][]): HTMLElement;
    _render_template(template: HTMLElement, tooltips: [string, string][], ds: ColumnarDataSource, i: number | ImageIndex, vars: TooltipVars): HTMLElement;
    _render_tooltips(ds: ColumnarDataSource, i: number | ImageIndex, vars: TooltipVars): HTMLElement;
}
export declare namespace HoverTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = InspectTool.Props & {
        tooltips: p.Property<string | [string, string][] | ((source: ColumnarDataSource, vars: TooltipVars) => HTMLElement)>;
        formatters: p.Property<Formatters>;
        renderers: p.Property<RendererSpec>;
        names: p.Property<string[]>;
        mode: p.Property<HoverMode>;
        muted_policy: p.Property<MutedPolicy>;
        point_policy: p.Property<PointPolicy>;
        line_policy: p.Property<LinePolicy>;
        show_arrow: p.Property<boolean>;
        anchor: p.Property<Anchor>;
        attachment: p.Property<TooltipAttachment>;
        callback: p.Property<CallbackLike1<HoverTool, {
            index: number;
            geometry: Geometry;
            renderer: Renderer;
        }> | null>;
    };
}
export interface HoverTool extends HoverTool.Attrs {
}
export declare class HoverTool extends InspectTool {
    properties: HoverTool.Props;
    __view_type__: HoverToolView;
    constructor(attrs?: Partial<HoverTool.Attrs>);
    static init_HoverTool(): void;
    tool_name: string;
    icon: string;
}
