"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BuildError extends Error {
    constructor(component, message) {
        super(message);
        this.component = component;
    }
}
exports.BuildError = BuildError;
BuildError.__name__ = "BuildError";
//# sourceMappingURL=error.js.map