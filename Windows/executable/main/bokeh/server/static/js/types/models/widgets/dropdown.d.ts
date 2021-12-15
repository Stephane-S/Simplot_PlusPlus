import { AbstractButton, AbstractButtonView } from "./abstract_button";
import { CallbackLike1 } from "../callbacks/callback";
import * as p from "../../core/properties";
export declare class DropdownView extends AbstractButtonView {
    model: Dropdown;
    protected _open: boolean;
    protected menu: HTMLElement;
    styles(): string[];
    render(): void;
    protected _show_menu(): void;
    protected _hide_menu(): void;
    protected _toggle_menu(): void;
    click(): void;
    protected _item_click(i: number): void;
}
export declare namespace Dropdown {
    type Attrs = p.AttrsOf<Props>;
    type Props = AbstractButton.Props & {
        split: p.Property<boolean>;
        menu: p.Property<(string | [string, string | CallbackLike1<Dropdown, {
            index: number;
        }>] | null)[]>;
    };
}
export interface Dropdown extends Dropdown.Attrs {
}
export declare class Dropdown extends AbstractButton {
    properties: Dropdown.Props;
    __view_type__: DropdownView;
    constructor(attrs?: Partial<Dropdown.Attrs>);
    static init_Dropdown(): void;
    get is_split(): boolean;
}
