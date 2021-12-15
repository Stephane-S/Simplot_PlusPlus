import { Annotation, AnnotationView } from "./annotation";
import { TooltipAttachment } from "../../core/enums";
import * as p from "../../core/properties";
export declare class TooltipView extends AnnotationView {
    model: Tooltip;
    protected el: HTMLElement;
    initialize(): void;
    remove(): void;
    connect_signals(): void;
    styles(): string[];
    render(): void;
    protected _render(): void;
    protected _reposition(): void;
}
export declare namespace Tooltip {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        attachment: p.Property<TooltipAttachment>;
        inner_only: p.Property<boolean>;
        show_arrow: p.Property<boolean>;
        position: p.Property<[number, number] | null>;
        content: p.Property<HTMLElement>;
        custom: p.Property<boolean>;
    };
}
export interface Tooltip extends Tooltip.Attrs {
}
export declare class Tooltip extends Annotation {
    properties: Tooltip.Props;
    __view_type__: TooltipView;
    constructor(attrs?: Partial<Tooltip.Attrs>);
    static init_Tooltip(): void;
    clear(): void;
}
