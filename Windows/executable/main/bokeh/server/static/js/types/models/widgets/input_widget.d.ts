import { Control, ControlView } from "./control";
import * as p from "../../core/properties";
export declare type HTMLInputElementLike = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export declare abstract class InputWidgetView extends ControlView {
    model: InputWidget;
    protected input_el: HTMLInputElementLike;
    protected label_el: HTMLLabelElement;
    protected group_el: HTMLElement;
    controls(): Generator<HTMLInputElementLike, void, unknown>;
    connect_signals(): void;
    styles(): string[];
    render(): void;
    change_input(): void;
}
export declare namespace InputWidget {
    type Attrs = p.AttrsOf<Props>;
    type Props = Control.Props & {
        title: p.Property<string>;
    };
}
export interface InputWidget extends InputWidget.Attrs {
}
export declare abstract class InputWidget extends Control {
    properties: InputWidget.Props;
    __view_type__: InputWidgetView;
    constructor(attrs?: Partial<InputWidget.Attrs>);
    static init_InputWidget(): void;
}
