import { Model } from "../../model";
import * as p from "../../core/properties";
import { union, intersection, difference } from "../../core/util/array";
import { merge } from "../../core/util/object";
export class Selection extends Model {
    constructor(attrs) {
        super(attrs);
    }
    get_view() {
        return this.view;
    }
    static init_Selection() {
        this.define({
            indices: [p.Array, []],
            line_indices: [p.Array, []],
            multiline_indices: [p.Any, {}],
        });
        this.internal({
            selected_glyphs: [p.Array, []],
            view: [p.Any],
            image_indices: [p.Array, []],
        });
    }
    initialize() {
        super.initialize();
    }
    get selected_glyph() {
        return this.selected_glyphs.length > 0 ? this.selected_glyphs[0] : null;
    }
    add_to_selected_glyphs(glyph) {
        this.selected_glyphs.push(glyph);
    }
    update(selection, _final = true, mode = "replace") {
        switch (mode) {
            case "replace": {
                this.indices = selection.indices;
                this.line_indices = selection.line_indices;
                this.selected_glyphs = selection.selected_glyphs;
                this.view = selection.view;
                this.multiline_indices = selection.multiline_indices;
                this.image_indices = selection.image_indices;
                break;
            }
            case "append": {
                this.update_through_union(selection);
                break;
            }
            case "intersect": {
                this.update_through_intersection(selection);
                break;
            }
            case "subtract": {
                this.update_through_subtraction(selection);
                break;
            }
        }
    }
    clear() {
        this.indices = [];
        this.line_indices = [];
        this.multiline_indices = {};
        this.view = null;
        this.selected_glyphs = [];
    }
    is_empty() {
        return this.indices.length == 0 && this.line_indices.length == 0 && this.image_indices.length == 0;
    }
    update_through_union(other) {
        this.indices = union(this.indices, other.indices);
        this.selected_glyphs = union(other.selected_glyphs, this.selected_glyphs);
        this.line_indices = union(other.line_indices, this.line_indices);
        this.view = other.view;
        this.multiline_indices = merge(other.multiline_indices, this.multiline_indices);
    }
    update_through_intersection(other) {
        this.indices = intersection(this.indices, other.indices);
        // TODO: think through and fix any logic below
        this.selected_glyphs = union(other.selected_glyphs, this.selected_glyphs);
        this.line_indices = union(other.line_indices, this.line_indices);
        this.view = other.view;
        this.multiline_indices = merge(other.multiline_indices, this.multiline_indices);
    }
    update_through_subtraction(other) {
        this.indices = difference(this.indices, other.indices);
        // TODO: think through and fix any logic below
        this.selected_glyphs = union(other.selected_glyphs, this.selected_glyphs);
        this.line_indices = union(other.line_indices, this.line_indices);
        this.view = other.view;
        this.multiline_indices = merge(other.multiline_indices, this.multiline_indices);
    }
}
Selection.__name__ = "Selection";
Selection.init_Selection();
//# sourceMappingURL=selection.js.map