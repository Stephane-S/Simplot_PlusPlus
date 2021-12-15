import { Model } from "../../model";
export class Expression extends Model {
    constructor(attrs) {
        super(attrs);
    }
    initialize() {
        super.initialize();
        this._connected = new Set();
        this._result = new Map();
    }
    v_compute(source) {
        if (!this._connected.has(source)) {
            this.connect(source.change, () => this._result.delete(source));
            this.connect(source.patching, () => this._result.delete(source));
            this.connect(source.streaming, () => this._result.delete(source));
            this._connected.add(source);
        }
        let result = this._result.get(source);
        if (result == null) {
            result = this._v_compute(source);
            this._result.set(source, result);
        }
        return result;
    }
}
Expression.__name__ = "Expression";
//# sourceMappingURL=expression.js.map