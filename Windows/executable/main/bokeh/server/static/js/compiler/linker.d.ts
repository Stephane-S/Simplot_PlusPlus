import * as ts from "typescript";
import * as terser from "terser";
import { Path } from "./sys";
export declare type Transformers = ts.TransformerFactory<ts.SourceFile>[];
export declare type Parent = {
    file: Path;
};
export declare type ResoType = "ESM" | "CJS";
export declare type ModuleType = "js" | "json" | "css";
export declare type ModuleInfo = {
    file: Path;
    base: Path;
    base_path: Path;
    canonical?: string;
    resolution: ResoType;
    id: number | string;
    hash: string;
    changed: boolean;
    type: ModuleType;
    source: string;
    ast?: ts.SourceFile;
    dependency_paths: Map<string, Path>;
    dependency_map: Map<string, number>;
    dependencies: Map<string, ModuleInfo>;
    externals: Set<string>;
    shims: Set<string>;
};
export declare type ModuleCode = {
    source: string;
    map?: string;
    min_source: string;
    min_map?: string;
};
export declare type ModuleArtifact = {
    module: ModuleInfo;
    code: ModuleCode;
};
export declare type Assembly = {
    prefix: string;
    suffix: string;
    wrap: (id: string, source: string) => string;
};
export declare class Bundle {
    readonly entry: ModuleInfo;
    readonly artifacts: ModuleArtifact[];
    readonly builtins: boolean;
    readonly prelude: string;
    readonly assembly: Assembly;
    constructor(entry: ModuleInfo, artifacts: ModuleArtifact[], builtins: boolean, prelude: string, assembly: Assembly);
    assemble(minified?: boolean): Artifact;
}
export declare class Artifact {
    readonly source: string;
    readonly sourcemap: object | null;
    readonly exported: Map<string, number | string>;
    constructor(source: string, sourcemap: object | null, exported: Map<string, number | string>);
    full_source(name: string): string;
    get module_names(): string[];
    write(path: string): void;
}
export interface LinkerOpts {
    entries: Path[];
    bases?: Path[];
    excludes?: Path[];
    externals?: (string | RegExp)[];
    excluded?: (dep: string) => boolean;
    builtins?: boolean;
    cache?: Path;
    target?: "ES2020" | "ES2017" | "ES5";
    es_modules?: boolean;
    minify?: boolean;
    plugin?: boolean;
    exports?: string[];
    prelude?: () => string;
    plugin_prelude?: () => string;
    shims?: string[];
}
export declare class Linker {
    readonly entries: Path[];
    readonly bases: Path[];
    readonly excludes: Set<Path>;
    readonly external_modules: Set<string>;
    readonly external_regex: RegExp[];
    readonly excluded: (dep: string) => boolean;
    readonly builtins: boolean;
    readonly cache_path?: Path;
    readonly cache: Map<Path, ModuleArtifact>;
    readonly target: "ES2020" | "ES2017" | "ES5" | null;
    readonly es_modules: boolean;
    readonly minify: boolean;
    readonly plugin: boolean;
    readonly exports: Set<string>;
    readonly prelude: string;
    readonly plugin_prelude: string;
    readonly shims: Set<string>;
    constructor(opts: LinkerOpts);
    is_external(dep: string): boolean;
    is_shimmed(dep: string): boolean;
    link(): Bundle[];
    load_cache(): void;
    store_cache(): void;
    protected readonly ext = ".js";
    resolve_package(dir: string): string | null;
    protected resolve_relative(dep: string, parent: Parent): Path | Error;
    protected resolve_absolute(dep: string, parent: Parent): Path | Error;
    resolve_file(dep: string, parent: Parent): Path | Error;
    private parse_module;
    new_module(file: Path): ModuleInfo;
    resolve(files: Path[]): [ModuleInfo[], ModuleInfo[]];
    reachable(entry: ModuleInfo, is_excluded: (module: ModuleInfo) => boolean): ModuleInfo[];
}
export declare function transpile(file: Path, source: string, target: ts.ScriptTarget, transformers?: {
    before: Transformers;
    after: Transformers;
}): {
    output: string;
    error?: string;
};
export declare function minify(module: ModuleInfo, source: string, ecma: terser.ECMA): {
    min_source: string;
    min_map?: string;
};
