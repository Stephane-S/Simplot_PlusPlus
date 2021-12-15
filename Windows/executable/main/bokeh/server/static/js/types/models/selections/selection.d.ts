import { Model } from "../../model";
import * as p from "../../core/properties";
import { SelectionMode } from "../../core/enums";
import { Glyph, GlyphView } from "../glyphs/glyph";
export declare type OpaqueIndices = number[];
export declare type MultiIndices = {
    [key: string]: OpaqueIndices;
};
export declare type ImageIndex = {
    index: number;
    dim1: number;
    dim2: number;
    flat_index: number;
};
export declare namespace Selection {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        indices: p.Property<OpaqueIndices>;
        line_indices: p.Property<OpaqueIndices>;
        selected_glyphs: p.Property<Glyph[]>;
        view: p.Property<GlyphView | null>;
        multiline_indices: p.Property<MultiIndices>;
        image_indices: p.Property<ImageIndex[]>;
    };
}
export interface Selection extends Selection.Attrs {
}
export declare class Selection extends Model {
    properties: Selection.Props;
    constructor(attrs?: Partial<Selection.Attrs>);
    get_view(): GlyphView | null;
    static init_Selection(): void;
    initialize(): void;
    get selected_glyph(): Glyph | null;
    add_to_selected_glyphs(glyph: Glyph): void;
    update(selection: Selection, _final?: boolean, mode?: SelectionMode): void;
    clear(): void;
    is_empty(): boolean;
    update_through_union(other: Selection): void;
    update_through_intersection(other: Selection): void;
    update_through_subtraction(other: Selection): void;
}
