import * as tp from "./util/types";
import { is_color } from "./util/color";
export class Kind {
}
Kind.__name__ = "Kind";
export var Kinds;
(function (Kinds) {
    class Any extends Kind {
        valid(_value) {
            return true;
        }
    }
    Any.__name__ = "Any";
    Kinds.Any = Any;
    class Unknown extends Kind {
        valid(_value) {
            return true;
        }
    }
    Unknown.__name__ = "Unknown";
    Kinds.Unknown = Unknown;
    class Boolean extends Kind {
        valid(value) {
            return tp.isBoolean(value);
        }
    }
    Boolean.__name__ = "Boolean";
    Kinds.Boolean = Boolean;
    class Ref extends Kind {
        constructor(obj_type) {
            super();
            this.obj_type = obj_type;
        }
        valid(value) {
            // XXX: disable validation for now, because object graph
            // initialization depends on this.
            value;
            return true;
            //return value instanceof this.obj_type
        }
    }
    Ref.__name__ = "Ref";
    Kinds.Ref = Ref;
    class Number extends Kind {
        valid(value) {
            return tp.isNumber(value);
        }
    }
    Number.__name__ = "Number";
    Kinds.Number = Number;
    class Int extends Number {
        valid(value) {
            return super.valid(value) && tp.isInteger(value);
        }
    }
    Int.__name__ = "Int";
    Kinds.Int = Int;
    class Or extends Kind {
        constructor(types) {
            super();
            this.types = types;
            this.types = types;
        }
        valid(value) {
            return this.types.some((type) => type.valid(value));
        }
    }
    Or.__name__ = "Or";
    Kinds.Or = Or;
    class Tuple extends Kind {
        constructor(types) {
            super();
            this.types = types;
            this.types = types;
        }
        valid(value) {
            if (!tp.isArray(value))
                return false;
            for (let i = 0; i < this.types.length; i++) {
                const type = this.types[i];
                const item = value[i];
                if (!type.valid(item))
                    return false;
            }
            return true;
        }
    }
    Tuple.__name__ = "Tuple";
    Kinds.Tuple = Tuple;
    class Array extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            return tp.isArray(value) && value.every((item) => this.item_type.valid(item));
        }
    }
    Array.__name__ = "Array";
    Kinds.Array = Array;
    class Null extends Kind {
        valid(value) {
            return value === null;
        }
    }
    Null.__name__ = "Null";
    Kinds.Null = Null;
    class Nullable extends Kind {
        constructor(base_type) {
            super();
            this.base_type = base_type;
        }
        valid(value) {
            return value === null || this.base_type.valid(value);
        }
    }
    Nullable.__name__ = "Nullable";
    Kinds.Nullable = Nullable;
    class String extends Kind {
        valid(value) {
            return tp.isString(value);
        }
    }
    String.__name__ = "String";
    Kinds.String = String;
    class Enum extends Kind {
        constructor(values) {
            super();
            this.values = new Set(values);
        }
        valid(value) {
            return this.values.has(value);
        }
        *[Symbol.iterator]() {
            yield* this.values;
        }
    }
    Enum.__name__ = "Enum";
    Kinds.Enum = Enum;
    class Struct extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            if (!tp.isPlainObject(value))
                return false;
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    const item = value[key];
                    if (!this.item_type.valid(item))
                        return false;
                }
            }
            return true;
        }
    }
    Struct.__name__ = "Struct";
    Kinds.Struct = Struct;
    class Dict extends Kind {
        constructor(key_type, item_type) {
            super();
            this.key_type = key_type;
            this.item_type = item_type;
        }
        valid(value) {
            if (!(value instanceof Map))
                return false;
            for (const [key, item] of value.entries()) {
                if (!(this.key_type.valid(key) && this.item_type.valid(item)))
                    return false;
            }
            return true;
        }
    }
    Dict.__name__ = "Dict";
    Kinds.Dict = Dict;
    class Color extends Kind {
        valid(value) {
            return tp.isString(value) && is_color(value);
        }
    }
    Color.__name__ = "Color";
    Kinds.Color = Color;
    class Percent extends Number {
        valid(value) {
            return super.valid(value) && 0 <= value && value <= 1.0;
        }
    }
    Percent.__name__ = "Percent";
    Kinds.Percent = Percent;
})(Kinds || (Kinds = {}));
export const Any = new Kinds.Any();
export const Unknown = new Kinds.Unknown();
export const Boolean = new Kinds.Boolean();
export const Number = new Kinds.Number();
export const Int = new Kinds.Int();
export const String = new Kinds.String();
export const Null = new Kinds.Null();
export const Nullable = (base_type) => new Kinds.Nullable(base_type);
export const Or = (...types) => new Kinds.Or(types);
export const Tuple = (...types) => new Kinds.Tuple(types);
export const Array = (item_type) => new Kinds.Array(item_type);
export const Struct = (item_type) => new Kinds.Struct(item_type);
export const Dict = (key_type, item_type) => new Kinds.Dict(key_type, item_type);
export const Enum = (...values) => new Kinds.Enum(values);
export const Ref = (obj_type) => new Kinds.Ref(obj_type);
export const Percent = new Kinds.Percent();
export const Color = new Kinds.Color();
export const Auto = Enum("auto");
export const FontSize = String;
export const Font = String;
export const Angle = Number;
//# sourceMappingURL=kinds.js.map