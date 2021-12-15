export function concat(array0, ...arrays) {
    let n = array0.length;
    for (const array of arrays)
        n += array.length;
    const result = new array0.constructor(n);
    result.set(array0, 0);
    let i = array0.length;
    for (const array of arrays) {
        result.set(array, i);
        i += array.length;
    }
    return result;
}
//# sourceMappingURL=typed_array.js.map