export function union(...sets) {
    const result = new Set();
    for (const set of sets) {
        for (const item of set) {
            result.add(item);
        }
    }
    return result;
}
export function intersection(set, ...sets) {
    const result = new Set();
    top: for (const item of set) {
        for (const other of sets) {
            if (!other.has(item))
                continue top;
        }
        result.add(item);
    }
    return result;
}
export function difference(set, ...sets) {
    const result = new Set(set);
    for (const item of union(...sets)) {
        result.delete(item);
    }
    return result;
}
//# sourceMappingURL=set.js.map