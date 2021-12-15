import { TickFormatter } from "./tick_formatter";
import * as p from "../../core/properties";
export declare namespace DatetimeTickFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = TickFormatter.Props & {
        microseconds: p.Property<string[]>;
        milliseconds: p.Property<string[]>;
        seconds: p.Property<string[]>;
        minsec: p.Property<string[]>;
        minutes: p.Property<string[]>;
        hourmin: p.Property<string[]>;
        hours: p.Property<string[]>;
        days: p.Property<string[]>;
        months: p.Property<string[]>;
        years: p.Property<string[]>;
    };
}
export interface DatetimeTickFormatter extends DatetimeTickFormatter.Attrs {
}
export declare class DatetimeTickFormatter extends TickFormatter {
    properties: DatetimeTickFormatter.Props;
    constructor(attrs?: Partial<DatetimeTickFormatter.Attrs>);
    static init_DatetimeTickFormatter(): void;
    protected strip_leading_zeros: boolean;
    protected _width_formats: {
        [key: string]: [number[], string[]];
    };
    initialize(): void;
    protected _update_width_formats(): void;
    protected _get_resolution_str(resolution_secs: number, span_secs: number): string;
    doFormat(ticks: number[], _opts: {
        loc: number;
    }): string[];
}
