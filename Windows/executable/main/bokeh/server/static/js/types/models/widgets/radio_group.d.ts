import * as p from "../../core/properties";
import { InputGroup, InputGroupView } from "./input_group";
export declare class RadioGroupView extends InputGroupView {
    model: RadioGroup;
    render(): void;
    change_active(i: number): void;
}
export declare namespace RadioGroup {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputGroup.Props & {
        active: p.Property<number>;
        labels: p.Property<string[]>;
        inline: p.Property<boolean>;
    };
}
export interface RadioGroup extends RadioGroup.Attrs {
}
export declare class RadioGroup extends InputGroup {
    properties: RadioGroup.Props;
    __view_type__: RadioGroupView;
    constructor(attrs?: Partial<RadioGroup.Attrs>);
    static init_RadioGroup(): void;
}
