import { index_of, find_index } from "../../core/util/arrayable";
import { isString } from "../../core/util/types";
export function _cat_equals(a, b) {
    if (a.length != b.length)
        return false;
    for (let i = 0, end = a.length; i < end; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
export function cat_v_compute(data, factors, targets, values, start, end, extra_value) {
    for (let i = 0, N = data.length; i < N; i++) {
        let d = data[i];
        let key;
        if (isString(d))
            key = index_of(factors, d);
        else {
            if (start != null) {
                if (end != null)
                    d = d.slice(start, end);
                else
                    d = d.slice(start);
            }
            else if (end != null)
                d = d.slice(0, end);
            if (d.length == 1)
                key = index_of(factors, d[0]);
            else
                key = find_index(factors, (x) => _cat_equals(x, d));
        }
        let value;
        if (key < 0 || key >= targets.length)
            value = extra_value;
        else
            value = targets[key];
        values[i] = value;
    }
}
//# sourceMappingURL=categorical_mapper.js.map