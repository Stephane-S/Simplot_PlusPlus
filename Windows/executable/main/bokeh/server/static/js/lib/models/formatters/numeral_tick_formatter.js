import * as Numbro from "@bokeh/numbro";
import { TickFormatter } from "./tick_formatter";
import * as p from "../../core/properties";
export class NumeralTickFormatter extends TickFormatter {
    constructor(attrs) {
        super(attrs);
    }
    static init_NumeralTickFormatter() {
        this.define({
            // TODO (bev) all of these could be tightened up
            format: [p.String, '0,0'],
            language: [p.String, 'en'],
            rounding: [p.RoundingFunction, 'round'],
        });
    }
    get _rounding_fn() {
        switch (this.rounding) {
            case "round":
            case "nearest":
                return Math.round;
            case "floor":
            case "rounddown":
                return Math.floor;
            case "ceil":
            case "roundup":
                return Math.ceil;
        }
    }
    doFormat(ticks, _opts) {
        const { format, language, _rounding_fn } = this;
        return ticks.map((tick) => Numbro.format(tick, format, language, _rounding_fn));
    }
}
NumeralTickFormatter.__name__ = "NumeralTickFormatter";
NumeralTickFormatter.init_NumeralTickFormatter();
//# sourceMappingURL=numeral_tick_formatter.js.map