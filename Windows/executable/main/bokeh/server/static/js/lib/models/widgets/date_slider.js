import tz from "timezone";
import { AbstractSlider, AbstractSliderView } from "./abstract_slider";
export class DateSliderView extends AbstractSliderView {
}
DateSliderView.__name__ = "DateSliderView";
export class DateSlider extends AbstractSlider {
    constructor(attrs) {
        super(attrs);
        this.behaviour = "tap";
        this.connected = [true, false];
    }
    static init_DateSlider() {
        this.prototype.default_view = DateSliderView;
        this.override({
            format: "%d %b %Y",
        });
    }
    _formatter(value, format) {
        return tz(value, format);
    }
}
DateSlider.__name__ = "DateSlider";
DateSlider.init_DateSlider();
//# sourceMappingURL=date_slider.js.map