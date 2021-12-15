import { TickFormatter } from "./tick_formatter";
import { RoundingFunction } from "../../core/enums";
import * as p from "../../core/properties";
export declare namespace NumeralTickFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = TickFormatter.Props & {
        format: p.Property<string>;
        language: p.Property<string>;
        rounding: p.Property<RoundingFunction>;
    };
}
export interface NumeralTickFormatter extends NumeralTickFormatter.Attrs {
}
export declare class NumeralTickFormatter extends TickFormatter {
    properties: NumeralTickFormatter.Props;
    constructor(attrs?: Partial<NumeralTickFormatter.Attrs>);
    static init_NumeralTickFormatter(): void;
    private get _rounding_fn();
    doFormat(ticks: number[], _opts: {
        loc: number;
    }): string[];
}
