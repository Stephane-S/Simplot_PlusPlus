import { InputWidget, InputWidgetView } from "./input_widget";
import * as p from "../../core/properties";
export declare class TextInputView extends InputWidgetView {
    model: TextInput;
    protected input_el: HTMLInputElement;
    connect_signals(): void;
    render(): void;
    change_input(): void;
    change_input_oninput(): void;
}
export declare namespace TextInput {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputWidget.Props & {
        value: p.Property<string>;
        value_input: p.Property<string>;
        placeholder: p.Property<string>;
    };
}
export interface TextInput extends TextInput.Attrs {
}
export declare class TextInput extends InputWidget {
    properties: TextInput.Props;
    __view_type__: TextInputView;
    constructor(attrs?: Partial<TextInput.Attrs>);
    static init_TextInput(): void;
}
