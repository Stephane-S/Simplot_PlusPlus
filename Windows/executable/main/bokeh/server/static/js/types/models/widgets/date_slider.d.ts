import { AbstractSlider, AbstractSliderView } from "./abstract_slider";
import * as p from "../../core/properties";
export declare class DateSliderView extends AbstractSliderView {
    model: DateSlider;
}
export declare namespace DateSlider {
    type Attrs = p.AttrsOf<Props>;
    type Props = AbstractSlider.Props;
}
export interface DateSlider extends DateSlider.Attrs {
}
export declare class DateSlider extends AbstractSlider {
    properties: DateSlider.Props;
    __view_type__: DateSliderView;
    constructor(attrs?: Partial<DateSlider.Attrs>);
    static init_DateSlider(): void;
    behaviour: "tap";
    connected: boolean[];
    protected _formatter(value: number, format: string): string;
}
