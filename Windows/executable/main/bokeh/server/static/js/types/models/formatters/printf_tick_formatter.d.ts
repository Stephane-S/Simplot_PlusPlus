import { TickFormatter } from "./tick_formatter";
import * as p from "../../core/properties";
export declare namespace PrintfTickFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = TickFormatter.Props & {
        format: p.Property<string>;
    };
}
export interface PrintfTickFormatter extends PrintfTickFormatter.Attrs {
}
export declare class PrintfTickFormatter extends TickFormatter {
    properties: PrintfTickFormatter.Props;
    constructor(attrs?: Partial<PrintfTickFormatter.Attrs>);
    static init_PrintfTickFormatter(): void;
    doFormat(ticks: number[], _opts: {
        loc: number;
    }): string[];
}
