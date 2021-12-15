import { UpperLower, UpperLowerView } from "./upper_lower";
import * as mixins from "../../core/property_mixins";
export class BandView extends UpperLowerView {
    connect_signals() {
        super.connect_signals();
        const update = () => this.set_data(this.model.source);
        this.connect(this.model.change, update);
        this.connect(this.model.source.streaming, update);
        this.connect(this.model.source.patching, update);
        this.connect(this.model.source.change, update);
    }
    _render() {
        this._map_data();
        const { ctx } = this.layer;
        // Draw the band body
        ctx.beginPath();
        ctx.moveTo(this._lower_sx[0], this._lower_sy[0]);
        for (let i = 0, end = this._lower_sx.length; i < end; i++) {
            ctx.lineTo(this._lower_sx[i], this._lower_sy[i]);
        }
        // iterate backwards so that the upper end is below the lower start
        for (let i = this._upper_sx.length - 1; i >= 0; i--) {
            ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
        }
        ctx.closePath();
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            ctx.fill();
        }
        // Draw the lower band edge
        ctx.beginPath();
        ctx.moveTo(this._lower_sx[0], this._lower_sy[0]);
        for (let i = 0, end = this._lower_sx.length; i < end; i++) {
            ctx.lineTo(this._lower_sx[i], this._lower_sy[i]);
        }
        if (this.visuals.line.doit) {
            this.visuals.line.set_value(ctx);
            ctx.stroke();
        }
        // Draw the upper band edge
        ctx.beginPath();
        ctx.moveTo(this._upper_sx[0], this._upper_sy[0]);
        for (let i = 0, end = this._upper_sx.length; i < end; i++) {
            ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
        }
        if (this.visuals.line.doit) {
            this.visuals.line.set_value(ctx);
            ctx.stroke();
        }
    }
}
BandView.__name__ = "BandView";
export class Band extends UpperLower {
    constructor(attrs) {
        super(attrs);
    }
    static init_Band() {
        this.prototype.default_view = BandView;
        this.mixins([mixins.Line /*Scalar*/, mixins.Fill /*Scalar*/]);
        this.override({
            fill_color: "#fff9ba",
            fill_alpha: 0.4,
            line_color: "#cccccc",
            line_alpha: 0.3,
        });
    }
}
Band.__name__ = "Band";
Band.init_Band();
//# sourceMappingURL=band.js.map