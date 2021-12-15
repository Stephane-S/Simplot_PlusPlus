import * as p from "../../../core/properties";
import { Color } from "../../../core/types";
import { FontStyle, TextAlign, RoundingFunction } from "../../../core/enums";
import { Model } from "../../../model";
export declare namespace CellFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface CellFormatter extends CellFormatter.Attrs {
}
export declare abstract class CellFormatter extends Model {
    properties: CellFormatter.Props;
    constructor(attrs?: Partial<CellFormatter.Attrs>);
    doFormat(_row: any, _cell: any, value: any, _columnDef: any, _dataContext: any): string;
}
export declare namespace StringFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = CellFormatter.Props & {
        font_style: p.Property<FontStyle>;
        text_align: p.Property<TextAlign>;
        text_color: p.Property<Color>;
    };
}
export interface StringFormatter extends StringFormatter.Attrs {
}
export declare class StringFormatter extends CellFormatter {
    properties: StringFormatter.Props;
    constructor(attrs?: Partial<StringFormatter.Attrs>);
    static init_StringFormatter(): void;
    doFormat(_row: any, _cell: any, value: any, _columnDef: any, _dataContext: any): string;
}
export declare namespace ScientificFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = StringFormatter.Props & {
        nan_format: p.Property<string>;
        precision: p.Property<number>;
        power_limit_high: p.Property<number>;
        power_limit_low: p.Property<number>;
    };
}
export interface ScientificFormatter extends ScientificFormatter.Attrs {
}
export declare class ScientificFormatter extends StringFormatter {
    properties: ScientificFormatter.Props;
    constructor(attrs?: Partial<ScientificFormatter.Attrs>);
    static init_ScientificFormatter(): void;
    get scientific_limit_low(): number;
    get scientific_limit_high(): number;
    doFormat(row: any, cell: any, value: any, columnDef: any, dataContext: any): string;
}
export declare namespace NumberFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = StringFormatter.Props & {
        format: p.Property<string>;
        language: p.Property<string>;
        nan_format: p.Property<string>;
        rounding: p.Property<RoundingFunction>;
    };
}
export interface NumberFormatter extends NumberFormatter.Attrs {
}
export declare class NumberFormatter extends StringFormatter {
    properties: NumberFormatter.Props;
    constructor(attrs?: Partial<NumberFormatter.Attrs>);
    static init_NumberFormatter(): void;
    doFormat(row: any, cell: any, value: any, columnDef: any, dataContext: any): string;
}
export declare namespace BooleanFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = CellFormatter.Props & {
        icon: p.Property<string>;
    };
}
export interface BooleanFormatter extends BooleanFormatter.Attrs {
}
export declare class BooleanFormatter extends CellFormatter {
    properties: BooleanFormatter.Props;
    constructor(attrs?: Partial<BooleanFormatter.Attrs>);
    static init_BooleanFormatter(): void;
    doFormat(_row: any, _cell: any, value: any, _columnDef: any, _dataContext: any): string;
}
export declare namespace DateFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = StringFormatter.Props & {
        format: p.Property<string>;
        nan_format: p.Property<string>;
    };
}
export interface DateFormatter extends DateFormatter.Attrs {
}
export declare class DateFormatter extends StringFormatter {
    properties: DateFormatter.Props;
    constructor(attrs?: Partial<DateFormatter.Attrs>);
    static init_DateFormatter(): void;
    getFormat(): string | undefined;
    doFormat(row: any, cell: any, value: any, columnDef: any, dataContext: any): string;
}
export declare namespace HTMLTemplateFormatter {
    type Attrs = p.AttrsOf<Props>;
    type Props = CellFormatter.Props & {
        template: p.Property<string>;
    };
}
export interface HTMLTemplateFormatter extends HTMLTemplateFormatter.Attrs {
}
export declare class HTMLTemplateFormatter extends CellFormatter {
    properties: HTMLTemplateFormatter.Props;
    constructor(attrs?: Partial<HTMLTemplateFormatter.Attrs>);
    static init_HTMLTemplateFormatter(): void;
    doFormat(_row: any, _cell: any, value: any, _columnDef: any, dataContext: any): string;
}
