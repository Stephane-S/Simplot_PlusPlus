const { sin, cos } = Math;
export class AffineTransform {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
    toString() {
        const { a, b, c, d, e, f } = this;
        return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    }
    clone() {
        const { a, b, c, d, e, f } = this;
        return new AffineTransform(a, b, c, d, e, f);
    }
    get is_identity() {
        const { a, b, c, d, e, f } = this;
        return a == 1 && b == 0 && c == 0 && d == 1 && e == 0 && f == 0;
    }
    apply(x, y) {
        const { a, b, c, d, e, f } = this;
        return [
            a * x + c * y + e,
            b * x + d * y + f,
        ];
    }
    iv_apply(xs, ys) {
        const { a, b, c, d, e, f } = this;
        const n = xs.length;
        for (let i = 0; i < n; i++) {
            const x = xs[i];
            const y = ys[i];
            xs[i] = a * x + c * y + e;
            ys[i] = b * x + d * y + f;
        }
    }
    transform(A, B, C, D, E, F) {
        const { a, b, c, d, e, f } = this;
        this.a = a * A + c * B;
        this.c = a * C + c * D;
        this.e = a * E + c * F + e;
        this.b = b * A + d * B;
        this.d = b * C + d * D;
        this.f = b * E + d * F + f;
        return this;
    }
    translate(tx, ty) {
        return this.transform(1, 0, 0, 1, tx, ty);
    }
    scale(cx, cy) {
        return this.transform(cx, 0, 0, cy, 0, 0);
    }
    skew(sx, sy) {
        return this.transform(1, sy, sx, 1, 0, 0);
    }
    rotate(angle) {
        const s = sin(angle);
        const c = cos(angle);
        return this.transform(c, s, -s, c, 0, 0);
    }
    rotate_ccw(angle) {
        return this.rotate(-angle);
    }
    translate_x(tx) {
        return this.translate(tx, 0);
    }
    translate_y(ty) {
        return this.translate(0, ty);
    }
    flip() {
        return this.scale(-1, -1);
    }
    flip_x() {
        return this.scale(1, -1);
    }
    flip_y() {
        return this.scale(-1, 1);
    }
}
AffineTransform.__name__ = "AffineTransform";
//# sourceMappingURL=affine.js.map