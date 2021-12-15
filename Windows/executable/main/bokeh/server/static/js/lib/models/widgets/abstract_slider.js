import * as noUiSlider from "nouislider";
import { div, span, empty } from "../../core/dom";
import { repeat } from "../../core/util/array";
import { Control, ControlView } from "./control";
import { TickFormatter } from "../formatters/tick_formatter";
import { bk_slider_value, bk_slider_title } from "../../styles/widgets/sliders";
import { bk_input_group } from "../../styles/widgets/inputs";
import nouislider_css from "../../styles/widgets/nouislider.css";
import sliders_css from "../../styles/widgets/sliders.css";
class AbstractBaseSliderView extends ControlView {
    *controls() {
        yield this.slider_el;
    }
    get noUiSlider() {
        return this.slider_el.noUiSlider;
    }
    connect_signals() {
        super.connect_signals();
        const { direction, orientation, tooltips } = this.model.properties;
        this.on_change([direction, orientation, tooltips], () => this.render());
        const { start, end, value, step, title } = this.model.properties;
        this.on_change([start, end, value, step], () => {
            const { start, end, value, step } = this._calc_to();
            this.noUiSlider.updateOptions({
                range: { min: start, max: end },
                start: value,
                step,
            });
        });
        const { bar_color } = this.model.properties;
        this.on_change(bar_color, () => {
            this._set_bar_color();
        });
        const { show_value } = this.model.properties;
        this.on_change([value, title, show_value], () => this._update_title());
    }
    styles() {
        return [...super.styles(), nouislider_css, sliders_css];
    }
    _update_title() {
        empty(this.title_el);
        const hide_header = this.model.title == null || (this.model.title.length == 0 && !this.model.show_value);
        this.title_el.style.display = hide_header ? "none" : "";
        if (!hide_header) {
            if (this.model.title.length != 0)
                this.title_el.textContent = `${this.model.title}: `;
            if (this.model.show_value) {
                const { value } = this._calc_to();
                const pretty = value.map((v) => this.model.pretty(v)).join(" .. ");
                this.title_el.appendChild(span({ class: bk_slider_value }, pretty));
            }
        }
    }
    _set_bar_color() {
        if (!this.model.disabled) {
            const connect_el = this.slider_el.querySelector(".noUi-connect");
            connect_el.style.backgroundColor = this.model.bar_color;
        }
    }
    render() {
        super.render();
        const { start, end, value, step } = this._calc_to();
        let tooltips; // XXX
        if (this.model.tooltips) {
            const formatter = {
                to: (value) => this.model.pretty(value),
            };
            tooltips = repeat(formatter, value.length);
        }
        else
            tooltips = false;
        if (this.slider_el == null) {
            this.slider_el = div();
            noUiSlider.create(this.slider_el, {
                range: { min: start, max: end },
                start: value,
                step,
                behaviour: this.model.behaviour,
                connect: this.model.connected,
                tooltips,
                orientation: this.model.orientation,
                direction: this.model.direction,
            });
            this.noUiSlider.on('slide', (_, __, values) => this._slide(values));
            this.noUiSlider.on('change', (_, __, values) => this._change(values));
            const toggleTooltip = (i, show) => {
                if (!tooltips)
                    return;
                const handle = this.slider_el.querySelectorAll(".noUi-handle")[i];
                const tooltip = handle.querySelector(".noUi-tooltip");
                tooltip.style.display = show ? 'block' : '';
            };
            this.noUiSlider.on('start', (_, i) => toggleTooltip(i, true));
            this.noUiSlider.on('end', (_, i) => toggleTooltip(i, false));
        }
        else {
            this.noUiSlider.updateOptions({
                range: { min: start, max: end },
                start: value,
                step,
            });
        }
        this._set_bar_color();
        if (this.model.disabled)
            this.slider_el.setAttribute('disabled', 'true');
        else
            this.slider_el.removeAttribute('disabled');
        this.title_el = div({ class: bk_slider_title });
        this._update_title();
        this.group_el = div({ class: bk_input_group }, this.title_el, this.slider_el);
        this.el.appendChild(this.group_el);
    }
    _slide(values) {
        this.model.value = this._calc_from(values);
    }
    _change(values) {
        this.model.value = this._calc_from(values);
        this.model.value_throttled = this.model.value;
    }
}
AbstractBaseSliderView.__name__ = "AbstractBaseSliderView";
export class AbstractSliderView extends AbstractBaseSliderView {
    _calc_to() {
        return {
            start: this.model.start,
            end: this.model.end,
            value: [this.model.value],
            step: this.model.step,
        };
    }
    _calc_from([value]) {
        if (Number.isInteger(this.model.start) && Number.isInteger(this.model.end) && Number.isInteger(this.model.step))
            return Math.round(value);
        else
            return value;
    }
}
AbstractSliderView.__name__ = "AbstractSliderView";
export class AbstractRangeSliderView extends AbstractBaseSliderView {
    _calc_to() {
        return {
            start: this.model.start,
            end: this.model.end,
            value: this.model.value,
            step: this.model.step,
        };
    }
    _calc_from(values) {
        return values;
    }
}
AbstractRangeSliderView.__name__ = "AbstractRangeSliderView";
export class AbstractSlider extends Control {
    // TODO: __view_type__: AbstractSliderView
    constructor(attrs) {
        super(attrs);
        this.connected = false;
    }
    static init_AbstractSlider() {
        this.define(({ Any, Boolean, Number, String, Color, Or, Enum, Ref }) => {
            return {
                title: [String, ""],
                show_value: [Boolean, true],
                start: [Any],
                end: [Any],
                value: [Any],
                value_throttled: [Any],
                step: [Number, 1],
                format: [Or(String, Ref(TickFormatter))],
                direction: [Enum("ltr", "rtl"), "ltr"],
                tooltips: [Boolean, true],
                bar_color: [Color, "#e6e6e6"],
            };
        });
    }
    _formatter(value, _format) {
        return `${value}`;
    }
    pretty(value) {
        return this._formatter(value, this.format);
    }
}
AbstractSlider.__name__ = "AbstractSlider";
AbstractSlider.init_AbstractSlider();
//# sourceMappingURL=abstract_slider.js.map