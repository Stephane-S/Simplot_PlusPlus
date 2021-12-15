import { Orientation } from "../enums";
export declare type ScreenPoint = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
};
export declare type MenuItem = {
    icon?: string;
    label?: string;
    tooltip?: string;
    active?: () => boolean;
    handler: () => void;
    if?: () => boolean;
} | null;
export declare type MenuOptions = {
    orientation?: Orientation;
    prevent_hide?: (event: MouseEvent) => boolean;
};
export declare class ContextMenu {
    readonly items: MenuItem[];
    readonly options: MenuOptions;
    readonly el: HTMLElement;
    protected _open: boolean;
    get is_open(): boolean;
    get can_open(): boolean;
    constructor(items: MenuItem[], options?: MenuOptions);
    protected _item_click: (i: number) => void;
    protected _on_mousedown: (event: MouseEvent) => void;
    protected _on_keydown: (event: KeyboardEvent) => void;
    protected _on_blur: () => void;
    remove(): void;
    protected _listen(): void;
    protected _unlisten(): void;
    protected _position(at: ScreenPoint): void;
    render(): void;
    show(at?: ScreenPoint): void;
    hide(): void;
    toggle(at?: ScreenPoint): void;
}
