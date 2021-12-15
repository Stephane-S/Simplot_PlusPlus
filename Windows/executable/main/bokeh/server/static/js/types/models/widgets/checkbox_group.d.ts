import { InputGroup, InputGroupView } from "./input_group";
import * as p from "../../core/properties";
export declare class CheckboxGroupView extends InputGroupView {
    model: CheckboxGroup;
    render(): void;
    change_active(i: number): void;
}
export declare namespace CheckboxGroup {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputGroup.Props & {
        active: p.Property<number[]>;
        labels: p.Property<string[]>;
        inline: p.Property<boolean>;
    };
}
export interface CheckboxGroup extends CheckboxGroup.Attrs {
}
export declare class CheckboxGroup extends InputGroup {
    properties: CheckboxGroup.Props;
    __view_type__: CheckboxGroupView;
    constructor(attrs?: Partial<CheckboxGroup.Attrs>);
    static init_CheckboxGroup(): void;
}
