import { Transform } from "../transforms/transform";
export class Mapper extends Transform {
    constructor(attrs) {
        super(attrs);
    }
    compute(_x) {
        // If it's just a single value, then a mapper doesn't really make sense.
        throw new Error("mapping single values is not supported");
    }
}
Mapper.__name__ = "Mapper";
//# sourceMappingURL=mapper.js.map