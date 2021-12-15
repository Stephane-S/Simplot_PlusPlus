import * as ts from "typescript";
import { Path } from "./sys";
export declare type CompileConfig = {
    out_dir?: OutDir;
    bokehjs_dir?: Path;
};
export declare type Inputs = Map<Path, string>;
export declare type Outputs = Map<Path, string>;
export declare type Diagnostics = readonly ts.Diagnostic[];
export declare type Failed = {
    diagnostics: Diagnostics;
};
export declare function is_failed<T>(obj: T | Failed): obj is Failed;
export declare type TSConfig = {
    files: Path[];
    options: ts.CompilerOptions;
    diagnostics?: undefined;
};
export interface TSOutput {
    diagnostics?: Diagnostics;
}
export declare function report_diagnostics(diagnostics: Diagnostics): {
    count: number;
    text: string;
};
export declare function compiler_host(inputs: Inputs, options: ts.CompilerOptions, bokehjs_dir?: Path): ts.CompilerHost;
export declare function default_transformers(options: ts.CompilerOptions): ts.CustomTransformers;
export declare function compile_files(inputs: Path[], options: ts.CompilerOptions, transformers?: ts.CustomTransformers, host?: ts.CompilerHost): TSOutput;
export declare type OutDir = Path | {
    js: Path;
    dts: Path;
};
export declare function parse_tsconfig(tsconfig_json: object, base_dir: Path, preconfigure?: ts.CompilerOptions): TSConfig | Failed;
export declare function read_tsconfig(tsconfig_path: Path, preconfigure?: ts.CompilerOptions): TSConfig | Failed;
export declare function compile_typescript(tsconfig_path: Path, config?: CompileConfig): void;
