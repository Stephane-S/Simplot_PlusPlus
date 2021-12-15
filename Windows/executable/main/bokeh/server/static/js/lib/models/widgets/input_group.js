import { Control, ControlView } from "./control";
import inputs_css from "../../styles/widgets/inputs.css";
export class InputGroupView extends ControlView {
    *controls() {
        yield* this._inputs;
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.render());
    }
    styles() {
        return [...super.styles(), inputs_css];
    }
}
InputGroupView.__name__ = "InputGroupView";
export class InputGroup extends Control {
    constructor(attrs) {
        super(attrs);
    }
}
InputGroup.__name__ = "InputGroup";
//# sourceMappingURL=input_group.js.map