import { AbstractSlider, AbstractRangeSliderView } from "./abstract_slider";
import * as p from "../../core/properties";
export declare class DateRangeSliderView extends AbstractRangeSliderView {
    model: DateRangeSlider;
}
export declare namespace DateRangeSlider {
    type Attrs = p.AttrsOf<Props>;
    type Props = AbstractSlider.Props;
}
export interface DateRangeSlider extends DateRangeSlider.Attrs {
}
export declare class DateRangeSlider extends AbstractSlider {
    properties: DateRangeSlider.Props;
    __view_type__: DateRangeSliderView;
    constructor(attrs?: Partial<DateRangeSlider.Attrs>);
    static init_DateRangeSlider(): void;
    behaviour: "drag";
    connected: boolean[];
    protected _formatter(value: number, format: string): string;
}
