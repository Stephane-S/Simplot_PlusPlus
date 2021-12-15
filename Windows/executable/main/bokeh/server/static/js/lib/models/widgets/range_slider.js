import * as numbro from "@bokeh/numbro";
import { AbstractSlider, AbstractRangeSliderView } from "./abstract_slider";
import { isString } from "../../core/util/types";
export class RangeSliderView extends AbstractRangeSliderView {
}
RangeSliderView.__name__ = "RangeSliderView";
export class RangeSlider extends AbstractSlider {
    constructor(attrs) {
        super(attrs);
        this.behaviour = "drag";
        this.connected = [false, true, false];
    }
    static init_RangeSlider() {
        this.prototype.default_view = RangeSliderView;
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
RangeSlider.__name__ = "RangeSlider";
RangeSlider.init_RangeSlider();
//# sourceMappingURL=range_slider.js.map