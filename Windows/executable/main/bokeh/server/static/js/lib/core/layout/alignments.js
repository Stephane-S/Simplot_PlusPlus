import { Layoutable } from "./layoutable";
import { BBox } from "../util/bbox";
export class Stack extends Layoutable {
    constructor() {
        super(...arguments);
        this.children = [];
    }
}
Stack.__name__ = "Stack";
export class HStack extends Stack {
    _measure(_viewport) {
        let width = 0;
        let height = 0;
        for (const child of this.children) {
            const size_hint = child.measure({ width: 0, height: 0 });
            width += size_hint.width;
            height = Math.max(height, size_hint.height);
        }
        return { width, height };
    }
    _set_geometry(outer, inner) {
        super._set_geometry(outer, inner);
        const { top, bottom } = outer;
        let { left } = outer;
        for (const child of this.children) {
            const { width } = child.measure({ width: 0, height: 0 });
            child.set_geometry(new BBox({ left, width, top, bottom }));
            left += width;
        }
    }
}
HStack.__name__ = "HStack";
export class VStack extends Stack {
    _measure(_viewport) {
        let width = 0;
        let height = 0;
        for (const child of this.children) {
            const size_hint = child.measure({ width: 0, height: 0 });
            width = Math.max(width, size_hint.width);
            height += size_hint.height;
        }
        return { width, height };
    }
    _set_geometry(outer, inner) {
        super._set_geometry(outer, inner);
        const { left, right } = outer;
        let { top } = outer;
        for (const child of this.children) {
            const { height } = child.measure({ width: 0, height: 0 });
            child.set_geometry(new BBox({ top, height, left, right }));
            top += height;
        }
    }
}
VStack.__name__ = "VStack";
export class AnchorLayout extends Layoutable {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    _measure(viewport) {
        let width = 0;
        let height = 0;
        for (const { layout } of this.children) {
            const size_hint = layout.measure(viewport);
            width = Math.max(width, size_hint.width);
            height = Math.max(height, size_hint.height);
        }
        return { width, height };
    }
    _set_geometry(outer, inner) {
        super._set_geometry(outer, inner);
        for (const { layout, anchor, margin } of this.children) {
            const { left, right, top, bottom, hcenter, vcenter } = outer;
            const { width, height } = layout.measure(outer);
            let bbox;
            switch (anchor) {
                case 'top_left':
                    bbox = new BBox({ left: left + margin, top: top + margin, width, height });
                    break;
                case 'top_center':
                    bbox = new BBox({ hcenter, top: top + margin, width, height });
                    break;
                case 'top_right':
                    bbox = new BBox({ right: right - margin, top: top + margin, width, height });
                    break;
                case 'bottom_right':
                    bbox = new BBox({ right: right - margin, bottom: bottom - margin, width, height });
                    break;
                case 'bottom_center':
                    bbox = new BBox({ hcenter, bottom: bottom - margin, width, height });
                    break;
                case 'bottom_left':
                    bbox = new BBox({ left: left + margin, bottom: bottom - margin, width, height });
                    break;
                case 'center_left':
                    bbox = new BBox({ left: left + margin, vcenter, width, height });
                    break;
                case 'center':
                    bbox = new BBox({ hcenter, vcenter, width, height });
                    break;
                case 'center_right':
                    bbox = new BBox({ right: right - margin, vcenter, width, height });
                    break;
            }
            layout.set_geometry(bbox);
        }
    }
}
AnchorLayout.__name__ = "AnchorLayout";
//# sourceMappingURL=alignments.js.map