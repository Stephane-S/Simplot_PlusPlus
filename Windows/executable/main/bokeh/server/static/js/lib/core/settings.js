export class Settings {
    constructor() {
        this._dev = false;
    }
    set dev(dev) {
        this._dev = dev;
    }
    get dev() {
        return this._dev;
    }
}
Settings.__name__ = "Settings";
export const settings = new Settings();
//# sourceMappingURL=settings.js.map