import { isPlainObject } from "./util/types";
export function isValue(obj) {
    return isPlainObject(obj) && "value" in obj;
}
export function isField(obj) {
    return isPlainObject(obj) && "field" in obj;
}
//# sourceMappingURL=vectorization.js.map