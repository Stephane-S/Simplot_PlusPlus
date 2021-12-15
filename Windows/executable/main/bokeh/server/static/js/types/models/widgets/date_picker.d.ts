import flatpickr from "flatpickr";
import { InputWidget, InputWidgetView } from "./input_widget";
import { CalendarPosition } from "../../core/enums";
import * as p from "../../core/properties";
declare type DateStr = string;
declare type DatesList = (DateStr | [DateStr, DateStr])[];
export declare class DatePickerView extends InputWidgetView {
    model: DatePicker;
    private _picker;
    connect_signals(): void;
    remove(): void;
    styles(): string[];
    render(): void;
    protected _on_change(_selected_dates: Date[], date_string: string, _instance: flatpickr.Instance): void;
}
export declare namespace DatePicker {
    type Attrs = p.AttrsOf<Props>;
    type Props = InputWidget.Props & {
        value: p.Property<string>;
        min_date: p.Property<string>;
        max_date: p.Property<string>;
        disabled_dates: p.Property<DatesList>;
        enabled_dates: p.Property<DatesList>;
        position: p.Property<CalendarPosition>;
        inline: p.Property<boolean>;
    };
}
export interface DatePicker extends DatePicker.Attrs {
}
export declare class DatePicker extends InputWidget {
    properties: DatePicker.Props;
    __view_type__: DatePickerView;
    constructor(attrs?: Partial<DatePicker.Attrs>);
    static init_DatePicker(): void;
}
export {};
