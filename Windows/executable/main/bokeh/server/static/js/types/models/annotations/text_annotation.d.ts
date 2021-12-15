import { Annotation, AnnotationView } from "./annotation";
import { Text, Line, Fill } from "../../core/visuals";
import { RenderMode } from "../../core/enums";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare abstract class TextAnnotationView extends AnnotationView {
    model: TextAnnotation;
    visuals: TextAnnotation.Visuals;
    readonly rotate: boolean;
    protected el?: HTMLElement;
    initialize(): void;
    remove(): void;
    connect_signals(): void;
    render(): void;
    protected _calculate_text_dimensions(ctx: Context2d, text: string): [number, number];
    protected _calculate_bounding_box_dimensions(ctx: Context2d, text: string): [number, number, number, number];
    protected _canvas_text(ctx: Context2d, text: string, sx: number, sy: number, angle: number): void;
    protected _css_text(ctx: Context2d, text: string, sx: number, sy: number, angle: number): void;
}
export declare namespace TextAnnotation {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        render_mode: p.Property<RenderMode>;
    };
    type Visuals = Annotation.Visuals & {
        text: Text;
        border_line: Line;
        background_fill: Fill;
    };
}
export interface TextAnnotation extends TextAnnotation.Attrs {
}
export declare abstract class TextAnnotation extends Annotation {
    properties: TextAnnotation.Props;
    __view_type__: TextAnnotationView;
    constructor(attrs?: Partial<TextAnnotation.Attrs>);
    static init_TextAnnotation(): void;
}
