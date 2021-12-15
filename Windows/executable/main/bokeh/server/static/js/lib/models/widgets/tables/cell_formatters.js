import tz from "timezone";
import * as Numbro from "@bokeh/numbro";
import { _ } from "underscore.template";
import * as p from "../../../core/properties";
import { div, i } from "../../../core/dom";
import { isString } from "../../../core/util/types";
import { Model } from "../../../model";
export class CellFormatter extends Model {
    constructor(attrs) {
        super(attrs);
    }
    doFormat(_row, _cell, value, _columnDef, _dataContext) {
        if (value == null)
            return "";
        else
            return (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
CellFormatter.__name__ = "CellFormatter";
export class StringFormatter extends CellFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_StringFormatter() {
        this.define({
            font_style: [p.FontStyle, "normal"],
            text_align: [p.TextAlign, "left"],
            text_color: [p.Color],
        });
    }
    doFormat(_row, _cell, value, _columnDef, _dataContext) {
        const { font_style, text_align, text_color } = this;
        const text = div({}, value == null ? "" : `${value}`);
        switch (font_style) {
            case "bold":
                text.style.fontWeight = "bold";
                break;
            case "italic":
                text.style.fontStyle = "italic";
                break;
        }
        if (text_align != null)
            text.style.textAlign = text_align;
        if (text_color != null)
            text.style.color = text_color;
        return text.outerHTML;
    }
}
StringFormatter.__name__ = "StringFormatter";
StringFormatter.init_StringFormatter();
export class ScientificFormatter extends StringFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_ScientificFormatter() {
        this.define({
            nan_format: [p.String],
            precision: [p.Number, 10],
            power_limit_high: [p.Number, 5],
            power_limit_low: [p.Number, -3],
        });
    }
    get scientific_limit_low() {
        return 10.0 ** this.power_limit_low;
    }
    get scientific_limit_high() {
        return 10.0 ** this.power_limit_high;
    }
    doFormat(row, cell, value, columnDef, dataContext) {
        const need_sci = value <= this.scientific_limit_low || value >= this.scientific_limit_high;
        let precision = this.precision;
        // toExponential does not handle precision values < 0 correctly
        if (precision < 1) {
            precision = 1;
        }
        if ((value == null || isNaN(value)) && this.nan_format != null)
            value = this.nan_format;
        else if (need_sci) {
            value = value.toExponential(precision);
        }
        else {
            value = value.toFixed(precision).replace(/(\.[0-9]*?)0+$/, "$1").replace(/\.$/, "");
        }
        // add StringFormatter formatting
        return super.doFormat(row, cell, value, columnDef, dataContext);
    }
}
ScientificFormatter.__name__ = "ScientificFormatter";
ScientificFormatter.init_ScientificFormatter();
export class NumberFormatter extends StringFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_NumberFormatter() {
        this.define({
            format: [p.String, '0,0'],
            language: [p.String, 'en'],
            rounding: [p.RoundingFunction, 'round'],
            nan_format: [p.String],
        });
    }
    doFormat(row, cell, value, columnDef, dataContext) {
        const { format, language, nan_format } = this;
        const rounding = (() => {
            switch (this.rounding) {
                case "round":
                case "nearest": return Math.round;
                case "floor":
                case "rounddown": return Math.floor;
                case "ceil":
                case "roundup": return Math.ceil;
            }
        })();
        if ((value == null || isNaN(value)) && nan_format != null)
            value = nan_format;
        else
            value = Numbro.format(value, format, language, rounding);
        return super.doFormat(row, cell, value, columnDef, dataContext);
    }
}
NumberFormatter.__name__ = "NumberFormatter";
NumberFormatter.init_NumberFormatter();
export class BooleanFormatter extends CellFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_BooleanFormatter() {
        this.define({
            icon: [p.String, 'check'],
        });
    }
    doFormat(_row, _cell, value, _columnDef, _dataContext) {
        return !!value ? i({ class: this.icon }).outerHTML : "";
    }
}
BooleanFormatter.__name__ = "BooleanFormatter";
BooleanFormatter.init_BooleanFormatter();
export class DateFormatter extends StringFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_DateFormatter() {
        this.define({
            format: [p.String, 'ISO-8601'],
            nan_format: [p.String],
        });
    }
    getFormat() {
        // using definitions provided here: https://api.jqueryui.com/datepicker/
        // except not implementing TICKS
        switch (this.format) {
            case "ATOM":
            case "W3C":
            case "RFC-3339":
            case "ISO-8601":
                return "%Y-%m-%d";
            case "COOKIE":
                return "%a, %d %b %Y";
            case "RFC-850":
                return "%A, %d-%b-%y";
            case "RFC-1123":
            case "RFC-2822":
                return "%a, %e %b %Y";
            case "RSS":
            case "RFC-822":
            case "RFC-1036":
                return "%a, %e %b %y";
            case "TIMESTAMP":
                return undefined;
            default:
                return this.format;
        }
    }
    doFormat(row, cell, value, columnDef, dataContext) {
        const { nan_format } = this;
        value = isString(value) ? parseInt(value, 10) : value;
        let date;
        // Handle null, NaN and NaT
        if ((value == null || isNaN(value) || value === -9223372036854776) && nan_format != null)
            date = nan_format;
        else
            date = value == null ? '' : tz(value, this.getFormat());
        return super.doFormat(row, cell, date, columnDef, dataContext);
    }
}
DateFormatter.__name__ = "DateFormatter";
DateFormatter.init_DateFormatter();
export class HTMLTemplateFormatter extends CellFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_HTMLTemplateFormatter() {
        this.define({
            template: [p.String, '<%= value %>'],
        });
    }
    doFormat(_row, _cell, value, _columnDef, dataContext) {
        const { template } = this;
        if (value == null)
            return "";
        else {
            const compiled_template = _.template(template);
            const context = Object.assign(Object.assign({}, dataContext), { value });
            return compiled_template(context);
        }
    }
}
HTMLTemplateFormatter.__name__ = "HTMLTemplateFormatter";
HTMLTemplateFormatter.init_HTMLTemplateFormatter();
//# sourceMappingURL=cell_formatters.js.map