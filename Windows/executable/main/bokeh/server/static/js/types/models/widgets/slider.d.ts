import { AbstractSlider, AbstractSliderView } from "./abstract_slider";
import * as p from "../../core/properties";
import { TickFormatter } from "../formatters/tick_formatter";
export declare class SliderView extends AbstractSliderView {
    model: Slider;
}
export declare namespace Slider {
    type Attrs = p.AttrsOf<Props>;
    type Props = AbstractSlider.Props;
}
export interface Slider extends Slider.Attrs {
}
export declare class Slider extends AbstractSlider {
    properties: Slider.Props;
    __view_type__: SliderView;
    constructor(attrs?: Partial<Slider.Attrs>);
    static init_Slider(): void;
    behaviour: "tap";
    connected: boolean[];
    protected _formatter(value: number, format: string | TickFormatter): string;
}
