import { NumericInputView, NumericInput } from "./numeric_input";
import * as p from "../../core/properties";
export declare class SpinnerView extends NumericInputView {
    model: Spinner;
    protected wrapper_el: HTMLDivElement;
    protected btn_up_el: HTMLButtonElement;
    protected btn_down_el: HTMLButtonElement;
    private _interval_handle;
    private _counter;
    private _interval;
    buttons(): Generator<HTMLButtonElement>;
    initialize(): void;
    connect_signals(): void;
    render(): void;
    get precision(): number;
    _start_incrementation(sign: 1 | -1): void;
    _stop_incrementation(): void;
    _btn_mouse_down(evt: MouseEvent): void;
    _btn_mouse_up(): void;
    _btn_mouse_leave(): void;
    _input_mouse_wheel(evt: WheelEvent): void;
    _input_key_down(evt: KeyboardEvent): void;
    adjust_to_precision(value: number): number;
    increment(step: number): void;
    change_input(): void;
}
export declare namespace Spinner {
    type Attrs = p.AttrsOf<Props>;
    type Props = NumericInput.Props & {
        value_throttled: p.Property<number | null>;
        step: p.Property<number>;
        page_step_multiplier: p.Property<number>;
        wheel_wait: p.Property<number>;
    };
}
export interface Spinner extends Spinner.Attrs {
}
export declare class Spinner extends NumericInput {
    properties: Spinner.Props;
    __view_type__: SpinnerView;
    constructor(attrs?: Partial<Spinner.Attrs>);
    static init_Spinner(): void;
}
