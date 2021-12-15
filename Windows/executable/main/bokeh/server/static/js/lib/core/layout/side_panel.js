import { Sizeable } from "./types";
import { ContentLayoutable } from "./layoutable";
import { isString } from "../util/types";
// This table lays out the rules for configuring the baseline, alignment, etc. of
// title text, based on it's location and orientation
//
// side    orient        baseline   align     angle   normal-dist
// ------------------------------------------------------------------------------
// above   parallel      bottom     center    0       height
//         normal        middle     left      -90     width
//         horizontal    bottom     center    0       height
//         [angle > 0]   middle     left              width * sin + height * cos
//         [angle < 0]   middle     right             width * sin + height * cos
//
// below   parallel      top        center    0       height
//         normal        middle     right     90      width
//         horizontal    top        center    0       height
//         [angle > 0]   middle     right             width * sin + height * cos
//         [angle < 0]   middle     left              width * sin + height * cos
//
// left    parallel      bottom     center    90      height
//         normal        middle     right     0       width
//         horizontal    middle     right     0       width
//         [angle > 0]   middle     right             width * cos + height * sin
//         [angle < 0]   middle     right             width * cos + height + sin
//
// right   parallel      bottom     center   -90      height
//         normal        middle     left     0        width
//         horizontal    middle     left     0        width
//         [angle > 0]   middle     left              width * cos + height * sin
//         [angle < 0]   middle     left              width * cos + height + sin
const pi2 = Math.PI / 2;
const ALPHABETIC = 'alphabetic';
const TOP = 'top';
const BOTTOM = 'bottom';
const MIDDLE = 'middle';
const HANGING = 'hanging';
const LEFT = 'left';
const RIGHT = 'right';
const CENTER = 'center';
const _angle_lookup = {
    above: {
        parallel: 0,
        normal: -pi2,
        horizontal: 0,
        vertical: -pi2,
    },
    below: {
        parallel: 0,
        normal: pi2,
        horizontal: 0,
        vertical: pi2,
    },
    left: {
        parallel: -pi2,
        normal: 0,
        horizontal: 0,
        vertical: -pi2,
    },
    right: {
        parallel: pi2,
        normal: 0,
        horizontal: 0,
        vertical: pi2,
    },
};
const _baseline_lookup = {
    above: {
        justified: TOP,
        parallel: ALPHABETIC,
        normal: MIDDLE,
        horizontal: ALPHABETIC,
        vertical: MIDDLE,
    },
    below: {
        justified: BOTTOM,
        parallel: HANGING,
        normal: MIDDLE,
        horizontal: HANGING,
        vertical: MIDDLE,
    },
    left: {
        justified: TOP,
        parallel: ALPHABETIC,
        normal: MIDDLE,
        horizontal: MIDDLE,
        vertical: ALPHABETIC,
    },
    right: {
        justified: TOP,
        parallel: ALPHABETIC,
        normal: MIDDLE,
        horizontal: MIDDLE,
        vertical: ALPHABETIC,
    },
};
const _align_lookup = {
    above: {
        justified: CENTER,
        parallel: CENTER,
        normal: LEFT,
        horizontal: CENTER,
        vertical: LEFT,
    },
    below: {
        justified: CENTER,
        parallel: CENTER,
        normal: LEFT,
        horizontal: CENTER,
        vertical: LEFT,
    },
    left: {
        justified: CENTER,
        parallel: CENTER,
        normal: RIGHT,
        horizontal: RIGHT,
        vertical: CENTER,
    },
    right: {
        justified: CENTER,
        parallel: CENTER,
        normal: LEFT,
        horizontal: LEFT,
        vertical: CENTER,
    },
};
const _align_lookup_negative = {
    above: RIGHT,
    below: LEFT,
    left: RIGHT,
    right: LEFT,
};
const _align_lookup_positive = {
    above: LEFT,
    below: RIGHT,
    left: RIGHT,
    right: LEFT,
};
export class SidePanel extends ContentLayoutable {
    constructor(side, obj) {
        super();
        this.side = side;
        this.obj = obj;
        switch (this.side) {
            case "above":
                this._dim = 0;
                this._normals = [0, -1];
                break;
            case "below":
                this._dim = 0;
                this._normals = [0, 1];
                break;
            case "left":
                this._dim = 1;
                this._normals = [-1, 0];
                break;
            case "right":
                this._dim = 1;
                this._normals = [1, 0];
                break;
        }
        if (this.is_horizontal)
            this.set_sizing({ width_policy: "max", height_policy: "fixed" });
        else
            this.set_sizing({ width_policy: "fixed", height_policy: "max" });
    }
    _content_size() {
        return new Sizeable(this.get_oriented_size());
    }
    get_oriented_size() {
        const { width, height } = this.obj.get_size();
        if (!this.obj.rotate || this.is_horizontal)
            return { width, height };
        else
            return { width: height, height: width };
    }
    has_size_changed() {
        const { width, height } = this.get_oriented_size();
        if (this.is_horizontal)
            return this.bbox.height != height;
        else
            return this.bbox.width != width;
    }
    get dimension() {
        return this._dim;
    }
    get normals() {
        return this._normals;
    }
    get is_horizontal() {
        return this._dim == 0;
    }
    get is_vertical() {
        return this._dim == 1;
    }
    apply_label_text_heuristics(ctx, orient) {
        const side = this.side;
        let baseline;
        let align;
        if (isString(orient)) {
            baseline = _baseline_lookup[side][orient];
            align = _align_lookup[side][orient];
        }
        else {
            if (orient < 0) {
                baseline = 'middle';
                align = _align_lookup_negative[side];
            }
            else {
                baseline = 'middle';
                align = _align_lookup_positive[side];
            }
        }
        ctx.textBaseline = baseline;
        ctx.textAlign = align;
    }
    get_label_angle_heuristic(orient) {
        return _angle_lookup[this.side][orient];
    }
}
SidePanel.__name__ = "SidePanel";
//# sourceMappingURL=side_panel.js.map