import * as ts from "typescript";
export declare function apply<T extends ts.Node>(node: T, ...transforms: ts.TransformerFactory<T>[]): T;
export declare function relativize_modules(relativize: (file: string, module_path: string) => string | null): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function add_init_class(): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function insert_class_name(): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function remove_use_strict(): (_context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function collect_imports(imports: Set<string>): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function collect_deps(source: ts.SourceFile): string[];
export declare function rewrite_deps(resolve: (dep: string) => number | string | undefined): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function rename_exports(): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
/**
 * Transform `var _this = _super.call(this, seq) || this;` into `var _this = new _super(seq);`.
 */
export declare function es5_fix_extend_builtins(): (context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function wrap_in_function(module_name: string): (_context: ts.TransformationContext) => (root: ts.SourceFile) => ts.SourceFile;
export declare function parse_es(file: string, code?: string, target?: ts.ScriptTarget): ts.SourceFile;
export declare function print_es(source: ts.SourceFile): string;
