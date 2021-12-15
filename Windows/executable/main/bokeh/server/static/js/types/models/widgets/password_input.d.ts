import { TextInput, TextInputView } from "./text_input";
import * as p from "../../core/properties";
export declare class PasswordInputView extends TextInputView {
    model: PasswordInput;
    render(): void;
}
export declare namespace PasswordInput {
    type Attrs = p.AttrsOf<Props>;
    type Props = TextInput.Props;
}
export interface PasswordInput extends PasswordInput.Attrs {
}
export declare class PasswordInput extends TextInput {
    properties: PasswordInput.Props;
    __view_type__: PasswordInputView;
    constructor(attrs?: Partial<PasswordInput.Attrs>);
    static init_PasswordInput(): void;
}
