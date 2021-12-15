import { StringFormatter } from "./cell_formatters";
import { StringEditor } from "./cell_editors";
import * as p from "../../../core/properties";
import { uniqueId } from "../../../core/util/string";
import { Model } from "../../../model";
export class TableColumn extends Model {
    constructor(attrs) {
        super(attrs);
    }
    static init_TableColumn() {
        this.define({
            field: [p.String],
            title: [p.String],
            width: [p.Number, 300],
            formatter: [p.Instance, () => new StringFormatter()],
            editor: [p.Instance, () => new StringEditor()],
            sortable: [p.Boolean, true],
            default_sort: [p.Sort, "ascending"],
        });
    }
    toColumn() {
        var _a;
        return {
            id: uniqueId(),
            field: this.field,
            name: (_a = this.title) !== null && _a !== void 0 ? _a : this.field,
            width: this.width,
            formatter: this.formatter != null ? this.formatter.doFormat.bind(this.formatter) : undefined,
            model: this.editor,
            editor: this.editor.default_view,
            sortable: this.sortable,
            defaultSortAsc: this.default_sort == "ascending",
        };
    }
}
TableColumn.__name__ = "TableColumn";
TableColumn.init_TableColumn();
//# sourceMappingURL=table_column.js.map