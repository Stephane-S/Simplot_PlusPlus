import { Model } from "../../model";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
import { Indices } from "../../core/types";
import { ColumnarDataSource } from "./columnar_data_source";
export class CDSView extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_CDSView() {
        this.define({
            filters: [p.Array, []],
            source: [p.Instance],
        });
        this.internal({
            indices: [p.Any],
            indices_map: [p.Any, {}],
            masked: [p.Any, null],
        });
    }
    initialize() {
        super.initialize();
        this.compute_indices();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.properties.filters.change, () => this.compute_indices());
        const connect_listeners = () => {
            const fn = () => this.compute_indices();
            if (this.source != null) {
                this.connect(this.source.change, fn);
                if (this.source instanceof ColumnarDataSource) {
                    this.connect(this.source.streaming, fn);
                    this.connect(this.source.patching, fn);
                }
            }
        };
        let initialized = this.source != null;
        if (initialized)
            connect_listeners();
        else {
            this.connect(this.properties.source.change, () => {
                if (!initialized) {
                    connect_listeners();
                    initialized = true;
                }
            });
        }
    }
    compute_indices() {
        var _a;
        const { source } = this;
        if (source == null)
            return;
        // XXX: if the data source is empty, there still may be one
        // index originating from glyph's scalar values.
        const size = (_a = source.get_length()) !== null && _a !== void 0 ? _a : 1;
        const indices = Indices.all_set(size);
        for (const filter of this.filters) {
            indices.intersect(filter.compute_indices(source));
        }
        this.indices = indices;
        this._indices = [...indices];
        this.indices_map_to_subset();
    }
    indices_map_to_subset() {
        this.indices_map = {};
        for (let i = 0; i < this._indices.length; i++) {
            this.indices_map[this._indices[i]] = i;
        }
    }
    convert_selection_from_subset(selection_subset) {
        const indices = selection_subset.indices.map((i) => this._indices[i]);
        return new Selection(Object.assign(Object.assign({}, selection_subset.attributes), { indices }));
    }
    convert_selection_to_subset(selection_full) {
        const indices = selection_full.indices.map((i) => this.indices_map[i]);
        return new Selection(Object.assign(Object.assign({}, selection_full.attributes), { indices }));
    }
    convert_indices_from_subset(indices) {
        return indices.map((i) => this._indices[i]);
    }
}
CDSView.__name__ = "CDSView";
CDSView.init_CDSView();
//# sourceMappingURL=cds_view.js.map