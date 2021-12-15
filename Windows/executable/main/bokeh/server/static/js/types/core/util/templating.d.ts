import { ColumnarDataSource } from "../../models/sources/columnar_data_source";
import { CustomJSHover } from "../../models/tools/inspectors/customjs_hover";
import { ImageIndex } from "../../models/selections/selection";
export declare type FormatterType = "numeral" | "printf" | "datetime";
export declare type FormatterSpec = CustomJSHover | FormatterType;
export declare type Formatters = {
    [key: string]: FormatterSpec;
};
export declare type FormatterFunc = (value: unknown, format: string, special_vars: Vars) => string;
export declare type Index = number | ImageIndex;
export declare type Vars = {
    [key: string]: unknown;
};
export declare const DEFAULT_FORMATTERS: {
    numeral: (value: string | number, format: string, _special_vars: Vars) => string;
    datetime: (value: unknown, format: string, _special_vars: Vars) => string;
    printf: (value: unknown, format: string, _special_vars: Vars) => string;
};
export declare function sprintf(format: string, ...args: unknown[]): string;
export declare function basic_formatter(value: unknown, _format: string, _special_vars: Vars): string;
export declare function get_formatter(raw_spec: string, format?: string, formatters?: Formatters): FormatterFunc;
export declare function get_value(raw_name: string, data_source: ColumnarDataSource, i: Index, special_vars: Vars): any;
export declare function replace_placeholders(content: string | {
    html: string;
}, data_source: ColumnarDataSource, i: Index, formatters?: Formatters, special_vars?: Vars): string | Node[];
