"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
const less_1 = __importDefault(require("less"));
const compiler_1 = require("./compiler");
const sys_1 = require("./sys");
const transforms = __importStar(require("./transforms"));
const tsconfig_json = __importStar(require("./tsconfig.ext.json"));
function parse_patched_tsconfig(base_dir, preconfigure) {
    // XXX: silence the config validator. We are providing inputs through `inputs` argument anyway.
    const json = Object.assign(Object.assign({}, tsconfig_json), { include: undefined, files: ["dummy.ts"] });
    return compiler_1.parse_tsconfig(json, base_dir, preconfigure);
}
function compile_typescript(base_dir, inputs, bokehjs_dir) {
    const preconfigure = {
        module: ts.ModuleKind.CommonJS,
        paths: {
            "*": [
                path.join(bokehjs_dir, "js/lib/*"),
                path.join(bokehjs_dir, "js/types/*"),
            ],
        },
        outDir: undefined,
    };
    const tsconfig = parse_patched_tsconfig(base_dir, preconfigure);
    if (tsconfig.diagnostics != null)
        return { diagnostics: tsconfig.diagnostics };
    const host = compiler_1.compiler_host(inputs, tsconfig.options, bokehjs_dir);
    const transformers = compiler_1.default_transformers(tsconfig.options);
    const outputs = new Map();
    host.writeFile = (name, data) => {
        outputs.set(name, data);
    };
    const files = [...inputs.keys()];
    return Object.assign({ outputs }, compiler_1.compile_files(files, tsconfig.options, transformers, host));
}
exports.compile_typescript = compile_typescript;
function compile_javascript(base_dir, file, code) {
    const tsconfig = parse_patched_tsconfig(base_dir, {});
    if (tsconfig.diagnostics != null)
        return { diagnostics: tsconfig.diagnostics };
    const { outputText, diagnostics } = ts.transpileModule(code, {
        fileName: file,
        reportDiagnostics: true,
        compilerOptions: {
            target: tsconfig.options.target,
            module: ts.ModuleKind.CommonJS,
        },
    });
    return { output: outputText, diagnostics };
}
function normalize(path) {
    return path.replace(/\\/g, "/");
}
async function compile_and_resolve_deps(input) {
    const { file, lang, bokehjs_dir } = input;
    const { code } = input;
    let output;
    switch (lang) {
        case "typescript":
            const inputs = new Map([[normalize(file), code]]);
            const { outputs, diagnostics } = compile_typescript(".", inputs, bokehjs_dir);
            if (diagnostics != null && diagnostics.length != 0) {
                const failure = compiler_1.report_diagnostics(diagnostics);
                return { error: failure.text };
            }
            else {
                const js_file = normalize(sys_1.rename(file, { ext: ".js" }));
                output = outputs.get(js_file);
            }
            break;
        case "javascript": {
            const result = compile_javascript(".", file, code);
            if (result.diagnostics != null && result.diagnostics.length != 0) {
                const failure = compiler_1.report_diagnostics(result.diagnostics);
                return { error: failure.text };
            }
            else {
                output = result.output;
            }
            break;
        }
        case "less":
            try {
                const { css } = await less_1.default.render(code, { filename: file, compress: true });
                return { code: css };
            }
            catch (error) {
                return { error: error.toString() };
            }
        default:
            throw new Error(`unsupported input type: ${lang}`);
    }
    const source = ts.createSourceFile(file, output, ts.ScriptTarget.ES5, true, ts.ScriptKind.JS);
    const deps = transforms.collect_deps(source);
    return { code: output, deps };
}
exports.compile_and_resolve_deps = compile_and_resolve_deps;
//# sourceMappingURL=compile.js.map