import * as numbro from "@bokeh/numbro";
import { AbstractSlider, AbstractSliderView } from "./abstract_slider";
import { isString } from "../../core/util/types";
export class SliderView extends AbstractSliderView {
}
SliderView.__name__ = "SliderView";
export class Slider extends AbstractSlider {
    constructor(attrs) {
        super(attrs);
        this.behaviour = "tap";
        this.connected = [true, false];
    }
    static init_Slider() {
        this.prototype.default_view = SliderView;
        this.override({
            format: "0[.]00",
        });
    }
    _formatter(value, format) {
        if (isString(format)) {
            return numbro.format(value, format);
        }
        else {
            return format.doFormat([value], { loc: 0 })[0];
        }
    }
}
Slider.__name__ = "Slider";
Slider.init_Slider();
//# sourceMappingURL=slider.js.map