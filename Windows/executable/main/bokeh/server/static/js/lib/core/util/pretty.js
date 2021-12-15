import { isBoolean, isNumber, isString, isArray, isIterable, isPlainObject } from "./types";
import { entries } from "./object";
export const pretty = Symbol("pretty");
function isPrintable(obj) {
    return pretty in Object(obj);
}
export class Printer {
    constructor(options) {
        this.precision = options === null || options === void 0 ? void 0 : options.precision;
    }
    to_string(obj) {
        if (isPrintable(obj))
            return obj[pretty](this);
        else if (isBoolean(obj))
            return this.boolean(obj);
        else if (isNumber(obj))
            return this.number(obj);
        else if (isString(obj))
            return this.string(obj);
        else if (isArray(obj))
            return this.array(obj);
        else if (isIterable(obj))
            return this.iterable(obj);
        else if (isPlainObject(obj))
            return this.object(obj);
        else
            return `${obj}`;
    }
    token(val) {
        return val;
    }
    boolean(val) {
        return `${val}`;
    }
    number(val) {
        if (this.precision != null)
            return val.toFixed(this.precision);
        else
            return `${val}`;
    }
    string(val) {
        return `"${val.replace(/'/g, "\\'")}"`; // lgtm [js/incomplete-sanitization]
    }
    array(obj) {
        const T = this.token;
        const items = [];
        for (const entry of obj) {
            items.push(this.to_string(entry));
        }
        return `${T("[")}${items.join(`${T(",")} `)}${T("]")}`;
    }
    iterable(obj) {
        var _a;
        const T = this.token;
        const tag = (_a = Object(obj)[Symbol.toStringTag]) !== null && _a !== void 0 ? _a : "Object";
        const items = this.array(obj);
        return `${tag}${T("(")}${items}${T(")")}`;
    }
    object(obj) {
        const T = this.token;
        const items = [];
        for (const [key, val] of entries(obj)) {
            items.push(`${key}${T(":")} ${this.to_string(val)}`);
        }
        return `${T("{")}${items.join(`${T(",")} `)}${T("}")}`;
    }
}
Printer.__name__ = "Printer";
export function to_string(obj, options) {
    const printer = new Printer(options);
    return printer.to_string(obj);
}
//# sourceMappingURL=pretty.js.map