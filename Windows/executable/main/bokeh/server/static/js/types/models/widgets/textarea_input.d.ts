import { InputWidget, InputWidgetView } from "./input_widget";
import * as p from "../../core/properties";
export declare class TextAreaInputView extends InputWidgetView {
    model: TextAreaInput;
    protected input_el: HTMLTextAreaElement;
    connect_signals(): void;
    render(): void;
    change_input(): void;
}
export declare namespace TextAreaInput {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputWidget.Props & {
        value: p.Property<string>;
        value_input: p.Property<string>;
        placeholder: p.Property<string>;
        cols: p.Property<number>;
        rows: p.Property<number>;
        max_length: p.Property<number>;
    };
}
export interface TextAreaInput extends TextAreaInput.Attrs {
}
export declare class TextAreaInput extends InputWidget {
    properties: TextAreaInput.Props;
    __view_type__: TextAreaInputView;
    constructor(attrs?: Partial<TextAreaInput.Attrs>);
    static init_TextAreaInput(): void;
}
