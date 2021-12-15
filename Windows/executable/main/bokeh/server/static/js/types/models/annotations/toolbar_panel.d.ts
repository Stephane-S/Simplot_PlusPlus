import { Annotation, AnnotationView } from "./annotation";
import { Toolbar } from "../tools/toolbar";
import { ToolbarBaseView } from "../tools/toolbar_base";
import { Size } from "../../core/layout";
import * as p from "../../core/properties";
import { SidePanel } from "../../core/layout/side_panel";
export declare class ToolbarPanelView extends AnnotationView {
    model: ToolbarPanel;
    panel: SidePanel;
    readonly rotate: boolean;
    protected _toolbar_view: ToolbarBaseView;
    protected el: HTMLElement;
    initialize(): void;
    lazy_initialize(): Promise<void>;
    remove(): void;
    render(): void;
    private _invalidate_toolbar;
    private _previous_bbox;
    protected _render(): void;
    protected _get_size(): Size;
}
export declare namespace ToolbarPanel {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        toolbar: p.Property<Toolbar>;
    };
}
export interface ToolbarPanel extends ToolbarPanel.Attrs {
}
export declare class ToolbarPanel extends Annotation {
    properties: ToolbarPanel.Props;
    __view_type__: ToolbarPanelView;
    constructor(attrs?: Partial<ToolbarPanel.Attrs>);
    static init_ToolbarPanel(): void;
}
