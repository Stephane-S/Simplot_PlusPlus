import { Control, ControlView } from "./control";
import { ButtonType } from "../../core/enums";
import * as p from "../../core/properties";
export declare abstract class ButtonGroupView extends ControlView {
    model: ButtonGroup;
    protected _buttons: HTMLElement[];
    controls(): Generator<any, void, any>;
    connect_signals(): void;
    styles(): string[];
    render(): void;
    abstract change_active(i: number): void;
    protected abstract _update_active(): void;
}
export declare namespace ButtonGroup {
    type Attrs = p.AttrsOf<Props>;
    type Props = Control.Props & {
        labels: p.Property<string[]>;
        button_type: p.Property<ButtonType>;
    };
}
export interface ButtonGroup extends ButtonGroup.Attrs {
}
export declare abstract class ButtonGroup extends Control {
    properties: ButtonGroup.Props & {
        active: p.Property<unknown>;
    };
    __view_type__: ButtonGroupView;
    constructor(attrs?: Partial<ButtonGroup.Attrs>);
    static init_ButtonGroup(): void;
}
