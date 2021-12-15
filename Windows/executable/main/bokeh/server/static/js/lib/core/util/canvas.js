function fixup_line_dash(ctx) {
    if (typeof ctx.lineDash === "undefined") {
        Object.defineProperty(ctx, "lineDash", {
            get: () => ctx.getLineDash(),
            set: (segments) => ctx.setLineDash(segments),
        });
    }
}
function fixup_image_smoothing(ctx) {
    ctx.setImageSmoothingEnabled = (value) => {
        ctx.imageSmoothingEnabled = value;
        ctx.mozImageSmoothingEnabled = value;
        ctx.oImageSmoothingEnabled = value;
        ctx.webkitImageSmoothingEnabled = value;
        ctx.msImageSmoothingEnabled = value;
    };
    ctx.getImageSmoothingEnabled = () => {
        const val = ctx.imageSmoothingEnabled;
        return val != null ? val : true;
    };
}
function fixup_measure_text(ctx) {
    if (ctx.measureText && ctx.html5MeasureText == null) {
        ctx.html5MeasureText = ctx.measureText;
        ctx.measureText = (text) => {
            const textMetrics = ctx.html5MeasureText(text);
            // fake it til you make it
            textMetrics.ascent = ctx.html5MeasureText("m").width * 1.6;
            return textMetrics;
        };
    }
}
function fixup_ellipse(ctx) {
    // implementing the ctx.ellipse function with bezier curves
    // we don't implement the startAngle, endAngle and anticlockwise arguments.
    function ellipse_bezier(x, y, radiusX, radiusY, rotation, _startAngle, _endAngle, anticlockwise = false) {
        const c = 0.551784; // see http://www.tinaja.com/glib/ellipse4.pdf
        ctx.translate(x, y);
        ctx.rotate(rotation);
        let rx = radiusX;
        let ry = radiusY;
        if (anticlockwise) {
            rx = -radiusX;
            ry = -radiusY;
        }
        ctx.moveTo(-rx, 0); // start point of first curve
        ctx.bezierCurveTo(-rx, ry * c, -rx * c, ry, 0, ry);
        ctx.bezierCurveTo(rx * c, ry, rx, ry * c, rx, 0);
        ctx.bezierCurveTo(rx, -ry * c, rx * c, -ry, 0, -ry);
        ctx.bezierCurveTo(-rx * c, -ry, -rx, -ry * c, -rx, 0);
        ctx.rotate(-rotation);
        ctx.translate(-x, -y);
    }
    if (!ctx.ellipse)
        ctx.ellipse = ellipse_bezier;
}
export function fixup_ctx(ctx) {
    fixup_line_dash(ctx);
    fixup_image_smoothing(ctx);
    fixup_measure_text(ctx);
    fixup_ellipse(ctx);
}
//# sourceMappingURL=canvas.js.map