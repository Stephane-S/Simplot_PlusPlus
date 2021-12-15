import { Annotation } from "./annotation";
import { Visuals } from "../../core/visuals";
import { LineVector, FillVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
export class ArrowHead extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    static init_ArrowHead() {
        this.define({
            size: [p.Number, 25],
        });
    }
    initialize() {
        super.initialize();
        this.visuals = new Visuals(this);
    }
}
ArrowHead.__name__ = "ArrowHead";
ArrowHead.init_ArrowHead();
export class OpenHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
    static init_OpenHead() {
        this.mixins(LineVector);
    }
    clip(ctx, i) {
        // This method should not begin or close a path
        this.visuals.line.set_vectorize(ctx, i);
        ctx.moveTo(0.5 * this.size, this.size);
        ctx.lineTo(0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, this.size);
        ctx.lineTo(0, 0);
        ctx.lineTo(0.5 * this.size, this.size);
    }
    render(ctx, i) {
        if (this.visuals.line.doit) {
            this.visuals.line.set_vectorize(ctx, i);
            ctx.beginPath();
            ctx.moveTo(0.5 * this.size, this.size);
            ctx.lineTo(0, 0);
            ctx.lineTo(-0.5 * this.size, this.size);
            ctx.stroke();
        }
    }
}
OpenHead.__name__ = "OpenHead";
OpenHead.init_OpenHead();
export class NormalHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
    static init_NormalHead() {
        this.mixins([LineVector, FillVector]);
        this.override({
            fill_color: 'black',
        });
    }
    clip(ctx, i) {
        // This method should not begin or close a path
        this.visuals.line.set_vectorize(ctx, i);
        ctx.moveTo(0.5 * this.size, this.size);
        ctx.lineTo(0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, this.size);
        ctx.lineTo(0.5 * this.size, this.size);
    }
    render(ctx, i) {
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_vectorize(ctx, i);
            this._normal(ctx, i);
            ctx.fill();
        }
        if (this.visuals.line.doit) {
            this.visuals.line.set_vectorize(ctx, i);
            this._normal(ctx, i);
            ctx.stroke();
        }
    }
    _normal(ctx, _i) {
        ctx.beginPath();
        ctx.moveTo(0.5 * this.size, this.size);
        ctx.lineTo(0, 0);
        ctx.lineTo(-0.5 * this.size, this.size);
        ctx.closePath();
    }
}
NormalHead.__name__ = "NormalHead";
NormalHead.init_NormalHead();
export class VeeHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
    static init_VeeHead() {
        this.mixins([LineVector, FillVector]);
        this.override({
            fill_color: 'black',
        });
    }
    clip(ctx, i) {
        // This method should not begin or close a path
        this.visuals.line.set_vectorize(ctx, i);
        ctx.moveTo(0.5 * this.size, this.size);
        ctx.lineTo(0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, -2);
        ctx.lineTo(-0.5 * this.size, this.size);
        ctx.lineTo(0, 0.5 * this.size);
        ctx.lineTo(0.5 * this.size, this.size);
    }
    render(ctx, i) {
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_vectorize(ctx, i);
            this._vee(ctx, i);
            ctx.fill();
        }
        if (this.visuals.line.doit) {
            this.visuals.line.set_vectorize(ctx, i);
            this._vee(ctx, i);
            ctx.stroke();
        }
    }
    _vee(ctx, _i) {
        ctx.beginPath();
        ctx.moveTo(0.5 * this.size, this.size);
        ctx.lineTo(0, 0);
        ctx.lineTo(-0.5 * this.size, this.size);
        ctx.lineTo(0, 0.5 * this.size);
        ctx.closePath();
    }
}
VeeHead.__name__ = "VeeHead";
VeeHead.init_VeeHead();
export class TeeHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
    static init_TeeHead() {
        this.mixins(LineVector);
    }
    render(ctx, i) {
        if (this.visuals.line.doit) {
            this.visuals.line.set_vectorize(ctx, i);
            ctx.beginPath();
            ctx.moveTo(0.5 * this.size, 0);
            ctx.lineTo(-0.5 * this.size, 0);
            ctx.stroke();
        }
    }
    clip(_ctx, _i) { }
}
TeeHead.__name__ = "TeeHead";
TeeHead.init_TeeHead();
//# sourceMappingURL=arrow_head.js.map