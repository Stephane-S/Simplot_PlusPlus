"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
function apply(node, ...transforms) {
    const result = ts.transform(node, transforms);
    return result.transformed[0];
}
exports.apply = apply;
function is_require(node) {
    return ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "require" &&
        node.arguments.length === 1;
}
function relativize_modules(relativize) {
    function relativize_specifier(source, expr) {
        if (expr != null && ts.isStringLiteralLike(expr) && expr.text.length > 0) {
            const relative = relativize(source.fileName, expr.text);
            if (relative != null)
                return ts.createLiteral(relative);
        }
        return null;
    }
    return (context) => (root) => {
        function visit(node) {
            if (ts.isImportDeclaration(node)) {
                const moduleSpecifier = relativize_specifier(root, node.moduleSpecifier);
                if (moduleSpecifier != null) {
                    const { decorators, modifiers, importClause } = node;
                    return ts.updateImportDeclaration(node, decorators, modifiers, importClause, moduleSpecifier);
                }
            }
            if (ts.isExportDeclaration(node)) {
                const moduleSpecifier = relativize_specifier(root, node.moduleSpecifier);
                if (moduleSpecifier != null) {
                    const { decorators, modifiers, exportClause } = node;
                    return ts.updateExportDeclaration(node, decorators, modifiers, exportClause, moduleSpecifier, false);
                }
            }
            if (is_require(node)) {
                const moduleSpecifier = relativize_specifier(root, node.arguments[0]);
                if (moduleSpecifier != null) {
                    const { expression, typeArguments } = node;
                    return ts.updateCall(node, expression, typeArguments, [moduleSpecifier]);
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(root, visit);
    };
}
exports.relativize_modules = relativize_modules;
function is_static(node) {
    return node.modifiers != null && node.modifiers.find((modifier) => modifier.kind == ts.SyntaxKind.StaticKeyword) != null;
}
function add_init_class() {
    return (context) => (root) => {
        function visit(node) {
            node = ts.visitEachChild(node, visit, context);
            if (ts.isClassDeclaration(node) && node.name != null) {
                const name = `init_${node.name.getText()}`;
                if (node.members.find((member) => ts.isMethodDeclaration(member) && member.name.getText() == name && is_static(member)) != null) {
                    const init = ts.createExpressionStatement(ts.createCall(ts.createPropertyAccess(node.name, name), undefined, undefined));
                    return [node, init];
                }
            }
            return node;
        }
        return ts.visitNode(root, visit);
    };
}
exports.add_init_class = add_init_class;
function insert_class_name() {
    function has__name__(node) {
        return node.members.find((member) => ts.isPropertyDeclaration(member) && member.name.getText() == "__name__" && is_static(member)) != null;
    }
    return (context) => (root) => {
        function visit(node) {
            node = ts.visitEachChild(node, visit, context);
            if (ts.isClassDeclaration(node) && node.name != null && !has__name__(node)) {
                const property = ts.createProperty(undefined, ts.createModifiersFromModifierFlags(ts.ModifierFlags.Static), "__name__", undefined, undefined, ts.createStringLiteral(node.name.text));
                node = ts.updateClassDeclaration(node, node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, [property, ...node.members]);
            }
            return node;
        }
        return ts.visitNode(root, visit);
    };
}
exports.insert_class_name = insert_class_name;
function remove_use_strict() {
    return (_context) => (root) => {
        const statements = root.statements.filter((node) => {
            if (ts.isExpressionStatement(node)) {
                const expr = node.expression;
                if (ts.isStringLiteral(expr) && expr.text == "use strict")
                    return false;
            }
            return true;
        });
        return ts.updateSourceFileNode(root, statements);
    };
}
exports.remove_use_strict = remove_use_strict;
function isImportCall(node) {
    return ts.isCallExpression(node) && node.expression.kind == ts.SyntaxKind.ImportKeyword;
}
function collect_imports(imports) {
    return (context) => (root) => {
        function visit(node) {
            if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                const name = node.moduleSpecifier;
                if (name != null && ts.isStringLiteral(name) && name.text.length != 0)
                    imports.add(name.text);
            }
            else if (isImportCall(node)) {
                const [name] = node.arguments;
                if (ts.isStringLiteral(name) && name.text.length != 0)
                    imports.add(name.text);
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(root, visit);
    };
}
exports.collect_imports = collect_imports;
function collect_deps(source) {
    function traverse(node) {
        if (is_require(node)) {
            const [arg] = node.arguments;
            if (ts.isStringLiteral(arg) && arg.text.length > 0)
                deps.add(arg.text);
        }
        ts.forEachChild(node, traverse);
    }
    const deps = new Set();
    traverse(source);
    return [...deps];
}
exports.collect_deps = collect_deps;
function rewrite_deps(resolve) {
    return (context) => (root) => {
        function visit(node) {
            if (is_require(node)) {
                const [arg] = node.arguments;
                if (ts.isStringLiteral(arg) && arg.text.length > 0) {
                    const dep = arg.text;
                    const val = resolve(dep);
                    if (val != null) {
                        node = ts.updateCall(node, node.expression, node.typeArguments, [ts.createLiteral(val)]);
                        ts.addSyntheticTrailingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, ` ${dep} `, false);
                    }
                    return node;
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(root, visit);
    };
}
exports.rewrite_deps = rewrite_deps;
// XXX: this is pretty naive, but affects very litte code
function rename_exports() {
    return (context) => (root) => {
        function is_exports(node) {
            return ts.isIdentifier(node) && node.text == "exports";
        }
        const has_exports = root.statements.some((stmt) => {
            return ts.isVariableStatement(stmt) && stmt.declarationList.declarations.some((decl) => is_exports(decl.name));
        });
        if (has_exports) {
            function visit(node) {
                if (is_exports(node)) {
                    const updated = ts.createIdentifier("exports$1");
                    const original = node;
                    ts.setOriginalNode(updated, original);
                    ts.setTextRange(updated, original);
                    return updated;
                }
                return ts.visitEachChild(node, visit, context);
            }
            return ts.visitNode(root, visit);
        }
        else
            return root;
    };
}
exports.rename_exports = rename_exports;
/**
 * Transform `var _this = _super.call(this, seq) || this;` into `var _this = new _super(seq);`.
 */
function es5_fix_extend_builtins() {
    return (context) => (root) => {
        function visit(node) {
            if (ts.isFunctionDeclaration(node)) {
                if (node.name != null && node.name.text.endsWith("NDArray") && node.body != null) {
                    const [stmt, ...rest] = node.body.statements;
                    if (ts.isVariableStatement(stmt) && stmt.declarationList.declarations.length == 1) {
                        const [decl] = stmt.declarationList.declarations;
                        if (ts.isIdentifier(decl.name) && decl.name.text == "_this" && decl.initializer != null) {
                            const init = ts.createNew(ts.createIdentifier("_super"), undefined, [ts.createIdentifier("seq")]);
                            const decl_new = ts.updateVariableDeclaration(decl, decl.name, decl.type, init);
                            const decls_new = ts.updateVariableDeclarationList(stmt.declarationList, [decl_new]);
                            const stmt_new = ts.updateVariableStatement(stmt, stmt.modifiers, decls_new);
                            const body = ts.createBlock([stmt_new, ...rest], true);
                            const constructor = ts.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, body);
                            return constructor;
                        }
                    }
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(root, visit);
    };
}
exports.es5_fix_extend_builtins = es5_fix_extend_builtins;
function wrap_in_function(module_name) {
    return (_context) => (root) => {
        const p = (name) => ts.createParameter(undefined, undefined, undefined, name);
        const params = [p("require"), p("module"), p("exports")];
        const block = ts.createBlock(root.statements, true);
        const func = ts.createFunctionDeclaration(undefined, undefined, undefined, "_", undefined, params, undefined, block);
        ts.addSyntheticLeadingComment(func, ts.SyntaxKind.MultiLineCommentTrivia, ` ${module_name} `, false);
        return ts.updateSourceFileNode(root, [func]);
    };
}
exports.wrap_in_function = wrap_in_function;
function parse_es(file, code, target = ts.ScriptTarget.ES2017) {
    return ts.createSourceFile(file, code != null ? code : ts.sys.readFile(file), target, true, ts.ScriptKind.JS);
}
exports.parse_es = parse_es;
function print_es(source) {
    const printer = ts.createPrinter();
    return printer.printNode(ts.EmitHint.SourceFile, source, source);
}
exports.print_es = print_es;
//# sourceMappingURL=transforms.js.map