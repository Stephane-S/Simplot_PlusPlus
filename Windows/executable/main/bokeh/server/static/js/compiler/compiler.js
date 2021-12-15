"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ts = __importStar(require("typescript"));
const path_1 = require("path");
const transforms = __importStar(require("./transforms"));
const error_1 = require("./error");
function is_failed(obj) {
    return "diagnostics" in obj && obj.diagnostics != null;
}
exports.is_failed = is_failed;
function normalize(path) {
    return path.replace(/\\/g, "/");
}
const diagnostics_host = {
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};
function report_diagnostics(diagnostics) {
    const errors = ts.sortAndDeduplicateDiagnostics(diagnostics);
    const text = ts.formatDiagnosticsWithColorAndContext(errors, diagnostics_host);
    return { count: errors.length, text };
}
exports.report_diagnostics = report_diagnostics;
function compiler_host(inputs, options, bokehjs_dir) {
    const default_host = ts.createCompilerHost(options);
    const host = Object.assign(Object.assign({}, default_host), { fileExists(name) {
            return inputs.get(name) != null || default_host.fileExists(name);
        },
        readFile(name) {
            return inputs.get(name) != null ? inputs.get(name) : default_host.readFile(name);
        },
        getSourceFile(name, target, _onError) {
            const source = inputs.get(name);
            if (source != null)
                return ts.createSourceFile(name, source, target);
            else
                return default_host.getSourceFile(name, target, _onError);
        } });
    if (bokehjs_dir != null) {
        host.getDefaultLibLocation = () => {
            // bokeh/server/static or bokehjs/build
            if (path_1.basename(bokehjs_dir) == "static")
                return path_1.join(bokehjs_dir, "lib");
            else
                return path_1.join(path_1.dirname(bokehjs_dir), "node_modules/typescript/lib");
        };
    }
    return host;
}
exports.compiler_host = compiler_host;
function default_transformers(options) {
    const transformers = {
        before: [],
        after: [],
        afterDeclarations: [],
    };
    const insert_class_name = transforms.insert_class_name();
    transformers.before.push(insert_class_name);
    const add_init_class = transforms.add_init_class();
    transformers.before.push(add_init_class);
    const base = options.baseUrl;
    if (base != null) {
        const relativize_modules = transforms.relativize_modules((file, module_path) => {
            if (!module_path.startsWith(".") && !module_path.startsWith("/")) {
                const module_file = path_1.join(base, module_path);
                if (ts.sys.fileExists(module_file) ||
                    ts.sys.fileExists(module_file + ".ts") ||
                    ts.sys.fileExists(path_1.join(module_file, "index.ts")) ||
                    options.outDir != null && ts.sys.fileExists(path_1.join(options.outDir, module_path + ".js"))) {
                    const rel_path = normalize(path_1.relative(path_1.dirname(file), module_file));
                    return rel_path.startsWith(".") ? rel_path : `./${rel_path}`;
                }
            }
            return null;
        });
        transformers.after.push(relativize_modules);
        transformers.afterDeclarations.push(relativize_modules);
    }
    return transformers;
}
exports.default_transformers = default_transformers;
function compile_files(inputs, options, transformers, host) {
    const program = ts.createProgram(inputs, options, host);
    const emitted = program.emit(undefined, undefined, undefined, false, transformers);
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitted.diagnostics);
    return diagnostics.length != 0 ? { diagnostics } : {};
}
exports.compile_files = compile_files;
function parse_tsconfig(tsconfig_json, base_dir, preconfigure) {
    const host = {
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        readDirectory: ts.sys.readDirectory,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
    };
    const tsconfig = ts.parseJsonConfigFileContent(tsconfig_json, host, base_dir, preconfigure);
    if (tsconfig.errors.length != 0) {
        return { diagnostics: tsconfig.errors };
    }
    return { files: tsconfig.fileNames, options: tsconfig.options };
}
exports.parse_tsconfig = parse_tsconfig;
function read_tsconfig(tsconfig_path, preconfigure) {
    const tsconfig_file = ts.readConfigFile(tsconfig_path, ts.sys.readFile);
    if (tsconfig_file.error != null) {
        return { diagnostics: [tsconfig_file.error] };
    }
    return parse_tsconfig(tsconfig_file.config, path_1.dirname(tsconfig_path), preconfigure);
}
exports.read_tsconfig = read_tsconfig;
function compile_project(tsconfig_path, config) {
    const preconfigure = (() => {
        const { out_dir } = config;
        if (out_dir != null) {
            if (typeof out_dir == "string")
                return { outDir: out_dir };
            else
                return { outDir: out_dir.js, declarationDir: out_dir.dts, declaration: true };
        }
        else
            return {};
    })();
    const tsconfig = read_tsconfig(tsconfig_path, preconfigure);
    if (is_failed(tsconfig))
        return { diagnostics: tsconfig.diagnostics };
    const { files, options } = tsconfig;
    const transformers = default_transformers(tsconfig.options);
    const host = compiler_host(new Map(), options, config.bokehjs_dir);
    return compile_files(files, options, transformers, host);
}
function compile_typescript(tsconfig_path, config = {}) {
    const result = compile_project(tsconfig_path, config);
    if (is_failed(result)) {
        const { count, text } = report_diagnostics(result.diagnostics);
        throw new error_1.BuildError("typescript", `There were ${chalk_1.default.red("" + count)} TypeScript errors:\n${text}`);
    }
}
exports.compile_typescript = compile_typescript;
//# sourceMappingURL=compiler.js.map