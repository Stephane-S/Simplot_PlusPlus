import { TickFormatter } from "./tick_formatter";
import { BasicTickFormatter } from "./basic_tick_formatter";
import { LogTicker } from "../tickers/log_ticker";
import * as p from "../../core/properties";
export declare namespace LogTickFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = TickFormatter.Props & {
        ticker: p.Property<LogTicker | null>;
    };
}
export interface LogTickFormatter extends LogTickFormatter.Attrs {
}
export declare class LogTickFormatter extends TickFormatter {
    properties: LogTickFormatter.Props;
    constructor(attrs?: Partial<LogTickFormatter.Attrs>);
    static init_LogTickFormatter(): void;
    protected basic_formatter: BasicTickFormatter;
    initialize(): void;
    doFormat(ticks: number[], opts: {
        loc: number;
    }): string[];
}
