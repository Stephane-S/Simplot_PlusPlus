import { ButtonGroup, ButtonGroupView } from "./button_group";
import * as p from "../../core/properties";
export declare class CheckboxButtonGroupView extends ButtonGroupView {
    model: CheckboxButtonGroup;
    get active(): Set<number>;
    change_active(i: number): void;
    protected _update_active(): void;
}
export declare namespace CheckboxButtonGroup {
    type Attrs = p.AttrsOf<Props>;
    type Props = ButtonGroup.Props & {
        active: p.Property<number[]>;
    };
}
export interface CheckboxButtonGroup extends CheckboxButtonGroup.Attrs {
}
export declare class CheckboxButtonGroup extends ButtonGroup {
    properties: CheckboxButtonGroup.Props;
    __view_type__: CheckboxButtonGroupView;
    constructor(attrs?: Partial<CheckboxButtonGroup.Attrs>);
    static init_CheckboxButtonGroup(): void;
}
