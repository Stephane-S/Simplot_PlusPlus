// Based on Underscore.js 1.8.3 (http://underscorejs.org)
export const equals = Symbol("equals");
export const wildcard = Symbol("wildcard");
const toString = Object.prototype.toString;
export class Comparator {
    constructor() {
        this.a_stack = [];
        this.b_stack = [];
    }
    eq(a, b) {
        if (Object.is(a, b))
            return true;
        if (a === wildcard || b === wildcard)
            return true;
        if (a == null || b == null)
            return a === b;
        const class_name = toString.call(a);
        if (class_name != toString.call(b))
            return false;
        switch (class_name) {
            case '[object Number]':
                return this.numbers(a, b);
            case '[object RegExp]':
            case '[object String]':
                return `${a}` == `${b}`;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        const { a_stack, b_stack } = this;
        let length = a_stack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (a_stack[length] === a)
                return b_stack[length] === b;
        }
        a_stack.push(a);
        b_stack.push(b);
        const result = (() => {
            if (a[equals] != null && b[equals] != null) {
                return a[equals](b, this);
            }
            switch (class_name) {
                case "[object Array]":
                case "[object Uint8Array]":
                case "[object Int8Array]":
                case "[object Uint16Array]":
                case "[object Int16Array]":
                case "[object Uint32Array]":
                case "[object Int32Array]":
                case "[object Float32Array]":
                case "[object Float64Array]": {
                    return this.arrays(a, b);
                }
                case "[object Map]":
                    return this.maps(a, b);
                case "[object Set]":
                    return this.sets(a, b);
                case "[object Object]": {
                    if (a.constructor == b.constructor && (a.constructor == null || a.constructor === Object)) {
                        return this.objects(a, b);
                    }
                }
                case "[object Function]": {
                    if (a.constructor == b.constructor && a.constructor === Function) {
                        return this.eq(`${a}`, `${b}`);
                    }
                }
            }
            if (a instanceof Node) {
                return this.nodes(a, b);
            }
            throw Error(`can't compare objects of type ${class_name}`);
        })();
        a_stack.pop();
        b_stack.pop();
        return result;
    }
    numbers(a, b) {
        return Object.is(a, b);
    }
    arrays(a, b) {
        const { length } = a;
        if (length != b.length)
            return false;
        for (let i = 0; i < length; i++) {
            if (!this.eq(a[i], b[i]))
                return false;
        }
        return true;
    }
    iterables(a, b) {
        const ai = a[Symbol.iterator]();
        const bi = b[Symbol.iterator]();
        while (true) {
            const an = ai.next();
            const bn = bi.next();
            if (an.done && bn.done)
                return true;
            if (an.done || bn.done)
                return false;
            if (!this.eq(an.value, bn.value))
                return false;
        }
    }
    maps(a, b) {
        if (a.size != b.size)
            return false;
        for (const [key, val] of a) {
            if (!b.has(key) || !this.eq(val, b.get(key)))
                return false;
        }
        return true;
    }
    sets(a, b) {
        if (a.size != b.size)
            return false;
        for (const key of a) {
            if (!b.has(key))
                return false;
        }
        return true;
    }
    objects(a, b) {
        const keys = Object.keys(a);
        if (keys.length != Object.keys(b).length)
            return false;
        for (const key of keys) {
            if (!b.hasOwnProperty(key) || !this.eq(a[key], b[key]))
                return false;
        }
        return true;
    }
    nodes(a, b) {
        if (a.nodeType != b.nodeType)
            return false;
        if (a.textContent != b.textContent)
            return false;
        if (!this.iterables(a.childNodes, b.childNodes))
            return false;
        return true;
    }
}
Comparator.__name__ = "Comparator";
const { abs } = Math;
export class SimilarComparator extends Comparator {
    constructor(tolerance = 1e-4) {
        super();
        this.tolerance = tolerance;
    }
    numbers(a, b) {
        return super.numbers(a, b) || abs(a - b) < this.tolerance;
    }
}
SimilarComparator.__name__ = "SimilarComparator";
export function is_equal(a, b) {
    const comparator = new Comparator();
    return comparator.eq(a, b);
}
export function is_similar(a, b, tolerance) {
    const comparator = new SimilarComparator(tolerance);
    return comparator.eq(a, b);
}
/** @deprecated */
export const isEqual = is_equal;
//# sourceMappingURL=eq.js.map