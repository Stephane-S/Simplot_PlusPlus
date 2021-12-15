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
const cp = __importStar(require("child_process"));
const path_1 = require("path");
const sys_1 = require("./sys");
const compiler_1 = require("./compiler");
const linker_1 = require("./linker");
const tsconfig_json = __importStar(require("./tsconfig.ext.json"));
const chalk_1 = __importDefault(require("chalk"));
const { cyan, magenta, red } = chalk_1.default;
const eslint_1 = require("eslint");
require("@typescript-eslint/eslint-plugin");
require("@typescript-eslint/parser");
const readline = __importStar(require("readline"));
function print(str) {
    console.log(str);
}
function npm_install(base_dir) {
    const npm = process.platform != "win32" ? "npm" : "npm.cmd";
    const { status } = cp.spawnSync(npm, ["install"], { stdio: "inherit", cwd: base_dir });
    if (status != null && status != 0) {
        print(`${cyan("npm install")} failed with exit code ${red(`${status}`)}.`);
        process.exit(status);
    }
}
function is_up_to_date(base_dir, file, metadata) {
    const contents = sys_1.read(path_1.join(base_dir, file));
    if (contents == null)
        return false;
    const old_hash = metadata.signatures[file];
    if (old_hash == null)
        return false;
    const new_hash = sys_1.hash(contents);
    return old_hash == new_hash;
}
function needs_install(base_dir, metadata) {
    if (!sys_1.directory_exists(path_1.join(base_dir, "node_modules")))
        return `New development environment.`;
    else if (!is_up_to_date(base_dir, "package.json", metadata))
        return `package.json has changed.`;
    else if (!is_up_to_date(base_dir, "package-lock.json", metadata))
        return `package-lock.json has changed.`;
    else
        return null;
}
function lint(config_file, paths) {
    const engine = new eslint_1.CLIEngine({
        configFile: config_file,
        extensions: [".ts", ".js"],
    });
    const report = engine.executeOnFiles(paths);
    eslint_1.CLIEngine.outputFixes(report);
    const ok = report.errorCount == 0;
    if (!ok) {
        const formatter = engine.getFormatter();
        const output = formatter(report.results);
        for (const line of output.trim().split("\n"))
            print(line);
    }
    return ok;
}
async function init(base_dir, _bokehjs_dir, base_setup) {
    print(`Working directory: ${cyan(base_dir)}`);
    const setup = {
        interactive: !!base_setup.interactive,
        bokehjs_version: base_setup.bokehjs_version != null ? base_setup.bokehjs_version : base_setup.bokeh_version.split("-")[0],
        bokeh_version: base_setup.bokeh_version,
    };
    const paths = {
        bokeh_ext: path_1.join(base_dir, "bokeh.ext.json"),
        package: path_1.join(base_dir, "package.json"),
        package_lock: path_1.join(base_dir, "package-lock.json"),
        tsconfig: path_1.join(base_dir, "tsconfig.json"),
        index: path_1.join(base_dir, "index.ts"),
    };
    const is_extension = sys_1.file_exists(paths.bokeh_ext);
    if (is_extension) {
        print("Already a bokeh extension. Quitting.");
        return false;
    }
    function write_json(path, json) {
        sys_1.write(path, JSON.stringify(json, undefined, 2));
        print(`Wrote ${cyan(path)}`);
    }
    const bokeh_ext_json = {};
    write_json(paths.bokeh_ext, bokeh_ext_json);
    const package_json = {
        name: path_1.basename(base_dir),
        version: "0.0.1",
        description: "",
        license: "BSD-3-Clause",
        keywords: [],
        repository: {},
        dependencies: {
            bokehjs: `^${setup.bokehjs_version}`,
        },
        devDependencies: {},
    };
    if (setup.interactive) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        async function ask(question, default_value) {
            return new Promise((resolve, _reject) => {
                rl.question(`${question} `, (answer) => {
                    resolve(answer.length != 0 ? answer : default_value);
                });
            });
        }
        async function ask_yn(question) {
            const ret = await ask(`${question} [y/n]`, "y");
            switch (ret) {
                case "y":
                    return true;
                case "n":
                    return false;
                default: {
                    print(`${red("Invalid input")}. Assuming no.`);
                    return false;
                }
            }
        }
        if (await ask_yn(`Create ${cyan("package.json")}? This will allow you to specify external dependencies.`)) {
            const { name } = package_json;
            package_json.name = await ask(`  What's the extension's name? [${name}]`, name);
            const { version } = package_json;
            package_json.version = await ask(`  What's the extension's version? [${version}]`, version);
            const { description } = package_json;
            package_json.description = await ask(`  What's the extension's description? [${description}]`, description);
            write_json(paths.package, package_json);
        }
        if (await ask_yn(`Create ${cyan("tsconfig.json")}? This will allow for customized configuration and improved IDE experience.`)) {
            write_json(paths.tsconfig, tsconfig_json);
        }
        rl.close();
    }
    else {
        write_json(paths.package, package_json);
        write_json(paths.tsconfig, tsconfig_json);
    }
    sys_1.write(paths.index, "");
    print(`Created empty ${cyan("index.ts")}. This is the entry point of your extension.`);
    const rel = path_1.relative(process.cwd(), base_dir);
    print(`You can build your extension with ${magenta(`bokeh build ${rel}`)}`);
    print("All done.");
    return true;
}
exports.init = init;
async function build(base_dir, bokehjs_dir, base_setup) {
    print(`Working directory: ${cyan(base_dir)}`);
    const setup = {
        rebuild: !!base_setup.rebuild,
        bokeh_version: base_setup.bokeh_version,
    };
    const bokeh_ext_json_path = path_1.join(base_dir, "bokeh.ext.json");
    const is_extension = sys_1.file_exists(bokeh_ext_json_path);
    if (!is_extension) {
        print("Not a bokeh extension. Quitting.");
        return false;
    }
    const metadata_path = path_1.join(base_dir, ".bokeh");
    const metadata = (() => {
        let obj = sys_1.read_json(metadata_path);
        if (obj == null)
            obj = {};
        if (obj.signatures == null)
            obj.signatures = {};
        return obj;
    })();
    if (metadata.bokeh_version != setup.bokeh_version) {
        print("Using different version of bokeh, rebuilding from scratch.");
        setup.rebuild = true;
    }
    const package_json_path = path_1.join(base_dir, "package.json");
    const package_lock_json_path = path_1.join(base_dir, "package-lock.json");
    const is_package = sys_1.file_exists(package_json_path);
    if (!is_package) {
        print(`${cyan(package_json_path)} doesn't exist. Not a npm package.`);
    }
    else {
        if (setup.rebuild) {
            print(`Running ${cyan("npm install")}.`);
            npm_install(base_dir);
        }
        else {
            const result = needs_install(base_dir, metadata);
            if (result != null) {
                print(`${result} Running ${cyan("npm install")}.`);
                npm_install(base_dir);
            }
        }
    }
    const tsconfig_path = path_1.join(base_dir, "tsconfig.json");
    const tsconfig = (() => {
        const preconfigure = {
            baseUrl: base_dir,
            paths: {
                "@bokehjs/*": [
                    path_1.join(bokehjs_dir, "js/lib/*"),
                    path_1.join(bokehjs_dir, "js/types/*"),
                ],
            },
        };
        if (sys_1.file_exists(tsconfig_path)) {
            print(`Using ${cyan(tsconfig_path)}`);
            return compiler_1.read_tsconfig(tsconfig_path, is_package ? undefined : preconfigure);
        }
        else
            return compiler_1.parse_tsconfig(tsconfig_json, base_dir, preconfigure);
    })();
    if (compiler_1.is_failed(tsconfig)) {
        print(compiler_1.report_diagnostics(tsconfig.diagnostics).text);
        return false;
    }
    const { files, options } = tsconfig;
    const transformers = compiler_1.default_transformers(options);
    const host = compiler_1.compiler_host(new Map(), options, bokehjs_dir);
    print(`Compiling TypeScript (${magenta(files.length + " files")})`);
    const tsoutput = compiler_1.compile_files(files, options, transformers, host);
    if (compiler_1.is_failed(tsoutput)) {
        print(compiler_1.report_diagnostics(tsoutput.diagnostics).text);
        if (options.noEmitOnError)
            return false;
    }
    const lint_config = path_1.join(base_dir, "eslint.json");
    if (sys_1.file_exists(lint_config)) {
        print(`Linting sources`);
        lint(lint_config, files);
    }
    const dist_dir = path_1.join(base_dir, "dist");
    const lib_dir = options.outDir || dist_dir;
    const artifact = path_1.basename(base_dir);
    const bases = [lib_dir];
    if (is_package)
        bases.push(path_1.join(base_dir, "node_modules"));
    const linker = new linker_1.Linker({
        entries: [path_1.join(lib_dir, "index.js")],
        bases,
        cache: path_1.join(dist_dir, `${artifact}.json`),
        excluded: (dep) => dep == "tslib" || dep.startsWith("@bokehjs/"),
        plugin: true,
        target: "ES2017",
    });
    print("Linking modules");
    if (!setup.rebuild)
        linker.load_cache();
    const bundles = linker.link();
    linker.store_cache();
    const outputs = [path_1.join(dist_dir, `${artifact}.js`)];
    const min_js = (js) => sys_1.rename(js, { ext: '.min.js' });
    function bundle(minified, outputs) {
        bundles
            .map((bundle) => bundle.assemble(minified))
            .map((artifact, i) => artifact.write(outputs[i]));
    }
    bundle(false, outputs);
    bundle(true, outputs.map(min_js));
    sys_1.write(metadata_path, JSON.stringify({
        bokeh_version: setup.bokeh_version,
        signatures: {
            "package.json": sys_1.hash_file(package_json_path),
            "package-lock.json": sys_1.hash_file(package_lock_json_path),
            "tsconfig.json": sys_1.hash_file(tsconfig_path),
        },
    }));
    print(`Output written to ${cyan(dist_dir)}`);
    print("All done.");
    return !compiler_1.is_failed(tsoutput);
}
exports.build = build;
//# sourceMappingURL=build.js.map