import { Layoutable } from "../../core/layout";
import { Location } from "../../core/enums";
import * as p from "../../core/properties";
import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { Model } from "../../model";
export declare class TabsView extends LayoutDOMView {
    model: Tabs;
    protected header: Layoutable;
    protected header_el: HTMLElement;
    protected wrapper_el: HTMLElement;
    protected scroll_el: HTMLElement;
    protected headers_el: HTMLElement;
    connect_signals(): void;
    styles(): string[];
    get child_models(): LayoutDOM[];
    _update_layout(): void;
    update_position(): void;
    render(): void;
    change_active(i: number): void;
    on_active_change(): void;
}
export declare namespace Tabs {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props & {
        tabs: p.Property<Panel[]>;
        tabs_location: p.Property<Location>;
        active: p.Property<number>;
    };
}
export interface Tabs extends Tabs.Attrs {
}
export declare class Tabs extends LayoutDOM {
    properties: Tabs.Props;
    __view_type__: TabsView;
    constructor(attrs?: Partial<Tabs.Attrs>);
    static init_Tabs(): void;
}
export declare namespace Panel {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        title: p.Property<string>;
        child: p.Property<LayoutDOM>;
        closable: p.Property<boolean>;
    };
}
export interface Panel extends Panel.Attrs {
}
export declare class Panel extends Model {
    properties: Panel.Props;
    constructor(attrs?: Partial<Panel.Attrs>);
    static init_Panel(): void;
}
