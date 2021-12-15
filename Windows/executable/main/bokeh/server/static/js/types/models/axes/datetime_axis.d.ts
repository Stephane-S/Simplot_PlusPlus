import { LinearAxis, LinearAxisView } from "./linear_axis";
import * as p from "../../core/properties";
export declare class DatetimeAxisView extends LinearAxisView {
    model: DatetimeAxis;
}
export declare namespace DatetimeAxis {
    type Attrs = p.AttrsOf<Props>;
    type Props = LinearAxis.Props & {};
}
export interface DatetimeAxis extends DatetimeAxis.Attrs {
}
export declare class DatetimeAxis extends LinearAxis {
    properties: DatetimeAxis.Props;
    __view_type__: DatetimeAxisView;
    constructor(attrs?: Partial<DatetimeAxis.Attrs>);
    static init_DatetimeAxis(): void;
}
