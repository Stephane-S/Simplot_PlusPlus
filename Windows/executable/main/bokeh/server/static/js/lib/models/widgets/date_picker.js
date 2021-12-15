import flatpickr from "flatpickr";
import { InputWidget, InputWidgetView } from "./input_widget";
import { input } from "../../core/dom";
import * as p from "../../core/properties";
import { isString } from "../../core/util/types";
import { bk_input } from "../../styles/widgets/inputs";
import flatpickr_css from "../../styles/widgets/flatpickr.css";
function _convert_date_list(value) {
    const result = [];
    for (const item of value) {
        if (isString(item))
            result.push(item);
        else {
            const [from, to] = item;
            result.push({ from, to });
        }
    }
    return result;
}
export class DatePickerView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        const { value, min_date, max_date, disabled_dates, enabled_dates, position, inline } = this.model.properties;
        this.connect(value.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.setDate(value.value()); });
        this.connect(min_date.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("minDate", min_date.value()); });
        this.connect(max_date.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("maxDate", max_date.value()); });
        this.connect(disabled_dates.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("disable", disabled_dates.value()); });
        this.connect(enabled_dates.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("enable", enabled_dates.value()); });
        this.connect(position.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("position", position.value()); });
        this.connect(inline.change, () => { var _a; return (_a = this._picker) === null || _a === void 0 ? void 0 : _a.set("inline", inline.value()); });
    }
    remove() {
        var _a;
        (_a = this._picker) === null || _a === void 0 ? void 0 : _a.destroy();
        super.remove();
    }
    styles() {
        return [...super.styles(), flatpickr_css];
    }
    render() {
        if (this._picker != null)
            return;
        super.render();
        this.input_el = input({ type: "text", class: bk_input, disabled: this.model.disabled });
        this.group_el.appendChild(this.input_el);
        this._picker = flatpickr(this.input_el, {
            defaultDate: this.model.value,
            minDate: this.model.min_date,
            maxDate: this.model.max_date,
            inline: this.model.inline,
            position: this.model.position,
            disable: _convert_date_list(this.model.disabled_dates),
            enable: _convert_date_list(this.model.enabled_dates),
            onChange: (selected_dates, date_string, instance) => this._on_change(selected_dates, date_string, instance),
        });
    }
    _on_change(_selected_dates, date_string, _instance) {
        this.model.value = date_string;
        this.change_input();
    }
}
DatePickerView.__name__ = "DatePickerView";
export class DatePicker extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
    static init_DatePicker() {
        this.prototype.default_view = DatePickerView;
        this.define({
            value: [p.Any],
            min_date: [p.Any],
            max_date: [p.Any],
            disabled_dates: [p.Any, []],
            enabled_dates: [p.Any, []],
            position: [p.CalendarPosition, "auto"],
            inline: [p.Boolean, false],
        });
    }
}
DatePicker.__name__ = "DatePicker";
DatePicker.init_DatePicker();
//# sourceMappingURL=date_picker.js.map