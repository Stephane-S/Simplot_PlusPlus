import { TextInput, TextInputView } from "./text_input";
export class PasswordInputView extends TextInputView {
    render() {
        super.render();
        this.input_el.type = "password";
    }
}
PasswordInputView.__name__ = "PasswordInputView";
export class PasswordInput extends TextInput {
    constructor(attrs) {
        super(attrs);
    }
    static init_PasswordInput() {
        this.prototype.default_view = PasswordInputView;
    }
}
PasswordInput.__name__ = "PasswordInput";
PasswordInput.init_PasswordInput();
//# sourceMappingURL=password_input.js.map