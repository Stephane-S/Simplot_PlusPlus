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
const path_1 = require("path");
const module_1 = __importDefault(require("module"));
const crypto_1 = __importDefault(require("crypto"));
const ts = __importStar(require("typescript"));
const terser = __importStar(require("terser"));
const combine = __importStar(require("combine-source-map"));
const convert = __importStar(require("convert-source-map"));
const sys_1 = require("./sys");
const compiler_1 = require("./compiler");
const preludes = __importStar(require("./prelude"));
const transforms = __importStar(require("./transforms"));
const error_1 = require("./error");
const root_path = process.cwd();
const cache_version = 3;
const to_obj = (map) => {
    const obj = Object.create(null);
    for (const [key, val] of map) {
        obj[key] = val;
    }
    return obj;
};
const dense_assembly = {
    prefix: "[",
    suffix: "]",
    wrap: (_, source) => source,
};
const sparse_assembly = {
    prefix: "{",
    suffix: "}",
    wrap: (id, source) => `${id}: ${source}`,
};
class Bundle {
    constructor(entry, artifacts, builtins, prelude, assembly) {
        this.entry = entry;
        this.artifacts = artifacts;
        this.builtins = builtins;
        this.prelude = prelude;
        this.assembly = assembly;
    }
    assemble(minified = false) {
        let line = 0;
        let sources = "";
        const sourcemap = combine.create();
        const aliases = new Map();
        const externals = new Map();
        const newlines = (source) => {
            const result = source.match(/\n/g);
            return result != null ? result.length : 0;
        };
        const safe_id = (module) => {
            const { id } = module;
            return typeof id == "number" ? id.toString() : JSON.stringify(id);
        };
        const { entry, artifacts, prelude, assembly: { prefix, suffix, wrap } } = this;
        sources += `${prelude}(${prefix}\n`;
        line += newlines(sources);
        for (const artifact of artifacts) {
            const { module } = artifact;
            if (module.canonical != null)
                aliases.set(module.canonical, module.id);
            for (const external of module.externals)
                externals.set(external, true);
            for (const external of module.shims)
                externals.set(external, false);
            const start = wrap(safe_id(module), "");
            sources += start;
            line += newlines(start);
            const source_with_sourcemap = minified ? artifact.code.min_source : artifact.code.source;
            const source = combine.removeComments(source_with_sourcemap).trimRight();
            sources += source;
            const map_path = path_1.join("@@", path_1.relative(root_path, module.file));
            sourcemap.addFile({ source: source_with_sourcemap, sourceFile: map_path }, { line });
            line += newlines(source);
            const end = ",\n";
            sources += end;
            line += newlines(end);
        }
        const aliases_json = JSON.stringify(to_obj(aliases));
        const externals_json = JSON.stringify(to_obj(externals));
        sources += `${suffix}, ${safe_id(entry)}, ${aliases_json}, ${externals_json});\n})\n`;
        const source_map = convert.fromBase64(sourcemap.base64()).toObject();
        return new Artifact(sources, minified ? null : source_map, aliases);
    }
}
exports.Bundle = Bundle;
Bundle.__name__ = "Bundle";
class Artifact {
    constructor(source, sourcemap, exported) {
        this.source = source;
        this.sourcemap = sourcemap;
        this.exported = exported;
    }
    full_source(name) {
        if (this.sourcemap != null)
            return `${this.source}\n${convert.generateMapFileComment(name)}\n`;
        else
            return `${this.source}\n`;
    }
    get module_names() {
        return Array.from(this.exported.keys());
    }
    write(path) {
        const dir = path_1.dirname(path);
        const name = path_1.basename(path, ".js");
        sys_1.write(path, this.full_source(name + ".js.map"));
        if (this.sourcemap != null) {
            sys_1.write(path_1.join(dir, name + ".js.map"), JSON.stringify(this.sourcemap));
        }
    }
}
exports.Artifact = Artifact;
Artifact.__name__ = "Artifact";
class Linker {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        this.ext = ".js";
        this.entries = opts.entries.map((path) => path_1.resolve(path));
        this.bases = ((_a = opts.bases) !== null && _a !== void 0 ? _a : []).map((path) => path_1.resolve(path));
        this.excludes = new Set(((_b = opts.excludes) !== null && _b !== void 0 ? _b : []).map((path) => path_1.resolve(path)));
        this.external_modules = new Set(((_c = opts.externals) !== null && _c !== void 0 ? _c : []).filter((s) => typeof s === "string"));
        this.external_regex = ((_d = opts.externals) !== null && _d !== void 0 ? _d : []).filter((s) => s instanceof RegExp);
        this.excluded = (_e = opts.excluded) !== null && _e !== void 0 ? _e : (() => false);
        this.builtins = (_f = opts.builtins) !== null && _f !== void 0 ? _f : false;
        this.exports = new Set((_g = opts.exports) !== null && _g !== void 0 ? _g : []);
        this.prelude = ((_h = opts.prelude) !== null && _h !== void 0 ? _h : preludes.prelude)();
        this.plugin_prelude = ((_j = opts.plugin_prelude) !== null && _j !== void 0 ? _j : preludes.plugin_prelude)();
        if (this.builtins) {
            this.external_modules.add("module");
            this.external_modules.add("constants");
            for (const lib of module_1.default.builtinModules)
                this.external_modules.add(lib);
        }
        for (const entry of this.entries) {
            if (!sys_1.file_exists(entry))
                throw new error_1.BuildError("linker", `entry path ${entry} doesn't exist or isn't a file`);
        }
        for (const base of this.bases) {
            if (!sys_1.directory_exists(base))
                throw new error_1.BuildError("linker", `base path ${base} doesn't exist or isn't a directory`);
        }
        this.cache_path = opts.cache;
        this.cache = new Map();
        this.target = (_k = opts.target) !== null && _k !== void 0 ? _k : null;
        this.es_modules = (_l = opts.es_modules) !== null && _l !== void 0 ? _l : true;
        this.minify = (_m = opts.minify) !== null && _m !== void 0 ? _m : true;
        this.plugin = (_o = opts.plugin) !== null && _o !== void 0 ? _o : false;
        this.shims = new Set((_p = opts.shims) !== null && _p !== void 0 ? _p : []);
    }
    is_external(dep) {
        return this.external_modules.has(dep) || this.external_regex.some((re) => re.test(dep));
    }
    is_shimmed(dep) {
        return this.shims.has(dep);
    }
    link() {
        const [entries] = this.resolve(this.entries);
        const [main, ...plugins] = entries;
        const dirnames = plugins.map((plugin) => path_1.dirname(plugin.file));
        const is_excluded = (module) => {
            return dirnames.find((e) => module.file.startsWith(e)) != null;
        };
        const main_modules = this.reachable(main, is_excluded);
        const parents = new Set(main_modules);
        const plugin_modules = [];
        for (const plugin of plugins) {
            const files = this.reachable(plugin, (module) => parents.has(module));
            plugin_modules.push(files);
        }
        const all_modules = main_modules.concat(...plugin_modules);
        if (!this.plugin)
            all_modules.forEach((module, i) => module.id = i);
        else
            all_modules.forEach((module) => module.id = module.hash.slice(0, 10));
        const transformers = (module) => {
            const transformers = [];
            const remove_use_strict = transforms.remove_use_strict();
            transformers.push(remove_use_strict);
            const rewrite_deps = transforms.rewrite_deps((dep) => {
                const module_dep = module.dependencies.get(dep);
                return module_dep != null ? module_dep.id : undefined;
            });
            transformers.push(rewrite_deps);
            transformers.push(transforms.wrap_in_function(module.base_path));
            return transformers;
        };
        const print = (module) => {
            let ast = module.ast || this.parse_module(module);
            ast = transforms.apply(ast, ...transformers(module));
            const source = transforms.print_es(ast);
            return convert.removeMapFileComments(source);
        };
        const deps_changed = (module, cached) => {
            if (module.dependencies.size != cached.dependencies.size)
                return false;
            for (const [dep, module_dep] of module.dependencies) {
                const cached_dep = cached.dependencies.get(dep);
                if (cached_dep == null || cached_dep.id != module_dep.id)
                    return true;
            }
            return false;
        };
        const artifacts = (modules) => {
            return modules.map((module) => {
                const cached = this.cache.get(module.file);
                let code;
                if (module.changed || (cached != null && deps_changed(module, cached.module))) {
                    const source = print(module);
                    const ecma = this.target == "ES2020" ? 2020 : (this.target == "ES2017" ? 2017 : 5);
                    const minified = this.minify ? minify(module, source, ecma) : { min_source: source };
                    code = Object.assign({ source }, minified);
                }
                else
                    code = cached.code;
                return { module, code };
            });
        };
        const main_prelude = !this.plugin ? this.prelude : this.plugin_prelude;
        const main_assembly = !this.plugin ? dense_assembly : sparse_assembly;
        const main_bundle = new Bundle(main, artifacts(main_modules), this.builtins, main_prelude, main_assembly);
        const plugin_bundles = [];
        for (let j = 0; j < plugins.length; j++) {
            const plugin_bundle = new Bundle(plugins[j], artifacts(plugin_modules[j]), this.builtins, this.plugin_prelude, sparse_assembly);
            plugin_bundles.push(plugin_bundle);
        }
        const bundles = [main_bundle, ...plugin_bundles];
        this.cache.clear();
        for (const bundle of bundles) {
            for (const artifact of bundle.artifacts) {
                this.cache.set(artifact.module.file, artifact);
            }
        }
        return bundles;
    }
    load_cache() {
        const { cache_path } = this;
        if (cache_path == null || !sys_1.file_exists(cache_path))
            return;
        this.cache.clear();
        const json = JSON.parse(sys_1.read(cache_path));
        if (json.version !== cache_version) {
            console.warn("ignoring cache due to format version mismatch");
            return;
        }
        for (const { module, code } of json.artifacts) {
            const artifact = {
                module: Object.assign(Object.assign({}, module), { ast: undefined, changed: false, dependencies: new Map(), dependency_map: new Map(module.dependency_map), dependency_paths: new Map(module.dependency_paths), externals: new Set(module.externals), shims: new Set(module.shims) }),
                code,
            };
            this.cache.set(artifact.module.file, artifact);
        }
        for (const { module } of this.cache.values()) {
            for (const [dep, file] of module.dependency_paths) {
                module.dependencies.set(dep, this.cache.get(file).module);
            }
        }
    }
    store_cache() {
        if (this.cache_path == null)
            return;
        const artifacts = [];
        for (const artifact of this.cache.values()) {
            const module = Object.assign({}, artifact.module);
            delete module.changed;
            delete module.ast;
            delete module.dependencies;
            artifacts.push({
                module: Object.assign(Object.assign({}, module), { dependency_map: [...module.dependency_map.entries()], dependency_paths: [...module.dependency_paths.entries()], externals: [...module.externals.values()], shims: [...module.shims.values()] }),
                code: artifact.code,
            });
        }
        const json = JSON.stringify({ version: cache_version, artifacts });
        sys_1.write(this.cache_path, json);
    }
    resolve_package(dir) {
        const index = (() => {
            const pkg_path = path_1.join(dir, "package.json");
            if (sys_1.file_exists(pkg_path)) {
                const pkg = JSON.parse(sys_1.read(pkg_path));
                if (this.target != null && pkg.module != null)
                    return pkg.module;
                if (pkg.main != null)
                    return pkg.main;
            }
            return "index.js";
        })();
        const path = path_1.join(dir, index);
        if (sys_1.file_exists(path))
            return path;
        const js_file = path + ".js";
        if (sys_1.file_exists(js_file))
            return js_file;
        const json_file = path + ".json";
        if (sys_1.file_exists(json_file))
            return json_file;
        if (sys_1.directory_exists(path)) {
            const index = path_1.join(path, "index.js");
            if (sys_1.file_exists(index))
                return index;
        }
        return null;
    }
    resolve_relative(dep, parent) {
        const path = path_1.resolve(path_1.dirname(parent.file), dep);
        if (sys_1.file_exists(path))
            return path;
        const js_file = path + ".js";
        const json_file = path + ".json";
        const has_js_file = sys_1.file_exists(js_file);
        const has_json_file = sys_1.file_exists(json_file);
        const has_file = has_js_file || has_json_file;
        if (sys_1.directory_exists(path)) {
            const pkg_file = this.resolve_package(path);
            if (pkg_file != null) {
                if (!has_file)
                    return pkg_file;
                else
                    return new error_1.BuildError("linker", `both ${has_js_file ? js_file : json_file} and ${pkg_file} exist`);
            }
        }
        if (has_js_file)
            return js_file;
        else if (has_json_file)
            return json_file;
        else
            return new error_1.BuildError("linker", `can't resolve '${dep}' from '${parent.file}'`);
    }
    resolve_absolute(dep, parent) {
        for (const base of this.bases) {
            let path = path_1.join(base, dep);
            if (sys_1.file_exists(path))
                return path;
            const js_file = path + ".js";
            if (sys_1.file_exists(js_file))
                return js_file;
            const json_file = path + ".json";
            if (sys_1.file_exists(json_file))
                return json_file;
            if (sys_1.directory_exists(path)) {
                const file = this.resolve_package(path);
                if (file != null)
                    return file;
            }
            if (parent.file.startsWith(base)) {
                let base_path = parent.file;
                while (true) {
                    base_path = path_1.dirname(base_path);
                    if (base_path == base)
                        break;
                    path = path_1.join(base_path, "node_modules", dep);
                    if (sys_1.directory_exists(path)) {
                        const file = this.resolve_package(path);
                        if (file != null)
                            return file;
                    }
                }
            }
        }
        return new error_1.BuildError("linker", `can't resolve '${dep}' from '${parent.file}'`);
    }
    resolve_file(dep, parent) {
        if (dep.startsWith("."))
            return this.resolve_relative(dep, parent);
        else
            return this.resolve_absolute(dep, parent);
    }
    parse_module({ file, source }) {
        return transforms.parse_es(file, source);
    }
    new_module(file) {
        let source = sys_1.read(file);
        if (source == null) {
            throw new error_1.BuildError("linker", `'${file} doesn't exist`);
        }
        const hash = crypto_1.default.createHash("sha256").update(source).digest("hex");
        const type = (() => {
            switch (path_1.extname(file)) {
                case ".json": return "json";
                case ".css": return "css";
                case ".mjs": return "js";
                case ".js": return "js";
                default:
                    throw new error_1.BuildError("linker", `unsupported extension of ${file}`);
            }
        })();
        const export_type = this.es_modules ? "default" : "=";
        switch (type) {
            case "json":
                source = `\
const json = ${source};
export ${export_type} json;
`;
                break;
            case "css":
                source = `\
const css = \`${source}\`;
export ${export_type} css;
`;
                break;
        }
        const [base, base_path, canonical, resolution] = (() => {
            var _a;
            const [primary, ...secondary] = this.bases;
            function canonicalize(path) {
                return path.replace(/\.js$/, "").replace(/\\/g, "/");
            }
            function get_package(base, path) {
                const root = path_1.join(base, path);
                base = path_1.normalize(base);
                path = path_1.normalize(root);
                while (path != base) {
                    if (sys_1.directory_exists(path)) {
                        const pkg_path = path_1.join(path, "package.json");
                        if (sys_1.file_exists(pkg_path))
                            return { dir: path, pkg: JSON.parse(sys_1.read(pkg_path)) };
                    }
                    path = path_1.dirname(path);
                }
                throw new error_1.BuildError("linker", `can't resolve package.json for ${root}`);
            }
            const path = path_1.relative(primary, file);
            if (!path.startsWith("..")) {
                return [primary, path, canonicalize(path), "ESM"];
            }
            for (const base of secondary) {
                const path = path_1.relative(base, file);
                if (!path.startsWith("..")) {
                    if (type == "js") {
                        const { dir, pkg } = get_package(base, path);
                        const reso = pkg.type == "module" || pkg.module != null ? "ESM" : "CJS";
                        const entry = (_a = pkg.module) !== null && _a !== void 0 ? _a : pkg.name;
                        const primary = entry != null && path_1.join(dir, entry) == path_1.join(base, path);
                        const name = canonicalize(primary ? path_1.basename(dir) : path);
                        const exported = this.exports.has(name);
                        return [base, path, exported ? name : undefined, reso];
                    }
                    else {
                        return [base, path, undefined, "ESM"];
                    }
                }
            }
            throw new error_1.BuildError("linker", `${file} is not under any of base paths`);
        })();
        const cached = this.cache.get(file);
        let ast;
        let dependency_paths;
        let externals;
        let shims;
        const changed = cached == null || cached.module.hash != hash;
        if (changed) {
            let collected = null;
            if ((this.target != null && resolution == "ESM") || type == "json") {
                const { ES2020, ES2017, ES5 } = ts.ScriptTarget;
                const target = this.target == "ES2020" ? ES2020 : (this.target == "ES2017" ? ES2017 : ES5);
                const imports = new Set(["tslib"]);
                const transform = {
                    before: [transforms.collect_imports(imports), transforms.rename_exports()],
                    after: [],
                };
                if (canonical == "core/util/ndarray" && target == ES5) {
                    transform.after.push(transforms.es5_fix_extend_builtins());
                }
                // XXX: .json extension will cause an internal error
                const { output, error } = transpile(type == "json" ? `${file}.ts` : file, source, target, transform);
                if (error)
                    throw new error_1.BuildError("linker", error);
                else {
                    source = output;
                    collected = [...imports];
                }
            }
            ast = this.parse_module({ file, source });
            if (collected == null)
                collected = transforms.collect_deps(ast);
            const filtered = collected.filter((dep) => !this.is_external(dep) && !this.excluded(dep) && !this.is_shimmed(dep));
            dependency_paths = new Map();
            for (const dep of filtered) {
                const resolved = this.resolve_file(dep, { file });
                if (resolved instanceof Error)
                    console.log(resolved);
                else
                    dependency_paths.set(dep, resolved);
            }
            externals = new Set(collected.filter((dep) => this.is_external(dep)));
            shims = new Set(collected.filter((dep) => this.is_shimmed(dep)));
        }
        else {
            dependency_paths = cached.module.dependency_paths;
            externals = cached.module.externals;
            shims = cached.module.shims;
            source = cached.module.source;
        }
        return {
            file,
            base,
            base_path,
            canonical,
            resolution,
            id: NaN,
            hash,
            changed,
            source,
            ast,
            type,
            dependency_paths,
            dependency_map: new Map(),
            dependencies: new Map(),
            externals,
            shims,
        };
    }
    resolve(files) {
        const visited = new Map();
        const pending = [...files];
        for (;;) {
            const file = pending.shift();
            if (file == null)
                break;
            if (visited.has(file) || this.excludes.has(file))
                continue;
            const module = this.new_module(file);
            visited.set(module.file, module);
            pending.unshift(...module.dependency_paths.values());
        }
        for (const module of visited.values()) {
            for (const [dep, file] of module.dependency_paths) {
                module.dependencies.set(dep, visited.get(file));
            }
        }
        const entries = files.map((file) => visited.get(file));
        return [entries, [...visited.values()]];
    }
    reachable(entry, is_excluded) {
        const reached = new Set();
        const pending = [entry];
        for (;;) {
            const module = pending.shift();
            if (module == null)
                break;
            if (reached.has(module) || this.excludes.has(module.file) || is_excluded(module))
                continue;
            reached.add(module);
            pending.unshift(...module.dependencies.values());
        }
        return [...reached.values()];
    }
}
exports.Linker = Linker;
Linker.__name__ = "Linker";
function transpile(file, source, target, transformers) {
    const { outputText: output, diagnostics } = ts.transpileModule(source, {
        fileName: file,
        reportDiagnostics: true,
        compilerOptions: {
            target,
            module: ts.ModuleKind.CommonJS,
            esModuleInterop: true,
            importHelpers: true,
            downlevelIteration: true,
        },
        transformers,
    });
    if (diagnostics == null || diagnostics.length == 0)
        return { output };
    else {
        const { text } = compiler_1.report_diagnostics(diagnostics);
        return { output, error: text };
    }
}
exports.transpile = transpile;
function minify(module, source, ecma) {
    const name = path_1.basename(module.file);
    const min_js = sys_1.rename(name, { ext: '.min.js' });
    const min_js_map = sys_1.rename(name, { ext: '.min.js.map' });
    const minify_opts = {
        ecma,
        output: {
            comments: /^!|copyright|license|\(c\)/i,
        },
        sourceMap: {
            filename: path_1.basename(min_js),
            url: path_1.basename(min_js_map),
        },
    };
    const { code, map, error } = terser.minify(source, minify_opts);
    if (error != null) {
        const { message, line, col } = error;
        throw new error_1.BuildError("linker", `${module.file}:${line - 1}:${col}: ${message}`);
    }
    return { min_source: code || "", min_map: typeof map === "string" ? map : undefined };
}
exports.minify = minify;
//# sourceMappingURL=linker.js.map