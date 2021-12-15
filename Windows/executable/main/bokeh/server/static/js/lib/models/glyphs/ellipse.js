import { EllipseOval, EllipseOvalView } from "./ellipse_oval";
export class EllipseView extends EllipseOvalView {
}
EllipseView.__name__ = "EllipseView";
export class Ellipse extends EllipseOval {
    constructor(attrs) {
        super(attrs);
    }
    static init_Ellipse() {
        this.prototype.default_view = EllipseView;
    }
}
Ellipse.__name__ = "Ellipse";
Ellipse.init_Ellipse();
//# sourceMappingURL=ellipse.js.map