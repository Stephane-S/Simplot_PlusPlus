import * as p from "../../../core/properties";
import { input, textarea, select, option, Keys } from "../../../core/dom";
import { DOMView } from "../../../core/dom_view";
import { Model } from "../../../model";
import { DTINDEX_NAME } from "./data_table";
import { bk_cell_editor } from "../../../styles/widgets/tables";
export class CellEditorView extends DOMView {
    constructor(options) {
        const { model, parent } = options.column;
        super(Object.assign({ model, parent }, options));
        this.args = options;
        this.initialize(); // XXX: no build_views()
        this.render(); // XXX: this isn't governed by layout
    }
    get emptyValue() {
        return null;
    }
    initialize() {
        super.initialize();
        this.inputEl = this._createInput();
        this.defaultValue = null;
    }
    async lazy_initialize() {
        throw new Error("unsupported");
    }
    css_classes() {
        return super.css_classes().concat(bk_cell_editor);
    }
    render() {
        super.render();
        this.args.container.append(this.el);
        this.el.appendChild(this.inputEl);
        this.renderEditor();
        this.disableNavigation();
    }
    renderEditor() { }
    disableNavigation() {
        this.inputEl.addEventListener("keydown", (event) => {
            switch (event.keyCode) {
                case Keys.Left:
                case Keys.Right:
                case Keys.Up:
                case Keys.Down:
                case Keys.PageUp:
                case Keys.PageDown:
                    event.stopImmediatePropagation();
            }
        });
    }
    destroy() {
        this.remove();
    }
    focus() {
        this.inputEl.focus();
    }
    show() { }
    hide() { }
    position() { }
    getValue() {
        return this.inputEl.value;
    }
    setValue(val) {
        this.inputEl.value = val;
    }
    serializeValue() {
        return this.getValue();
    }
    isValueChanged() {
        return !(this.getValue() == "" && this.defaultValue == null) && this.getValue() !== this.defaultValue;
    }
    applyValue(item, state) {
        const grid_data = this.args.grid.getData();
        const offset = grid_data.index.indexOf(item[DTINDEX_NAME]);
        grid_data.setField(offset, this.args.column.field, state);
    }
    loadValue(item) {
        const value = item[this.args.column.field];
        this.defaultValue = value != null ? value : this.emptyValue;
        this.setValue(this.defaultValue);
    }
    validateValue(value) {
        if (this.args.column.validator) {
            const result = this.args.column.validator(value);
            if (!result.valid) {
                return result;
            }
        }
        return { valid: true, msg: null };
    }
    validate() {
        return this.validateValue(this.getValue());
    }
}
CellEditorView.__name__ = "CellEditorView";
export class CellEditor extends Model {
}
CellEditor.__name__ = "CellEditor";
export class StringEditorView extends CellEditorView {
    get emptyValue() {
        return "";
    }
    _createInput() {
        return input({ type: "text" });
    }
    renderEditor() {
        //completions = @model.completions
        //if completions.length != 0
        //  @inputEl.classList.add("bk-cell-editor-completion")
        //  $(@inputEl).autocomplete({source: completions})
        //  $(@inputEl).autocomplete("widget")
        this.inputEl.focus();
        this.inputEl.select();
    }
    loadValue(item) {
        super.loadValue(item);
        this.inputEl.defaultValue = this.defaultValue;
        this.inputEl.select();
    }
}
StringEditorView.__name__ = "StringEditorView";
export class StringEditor extends CellEditor {
    static init_StringEditor() {
        this.prototype.default_view = StringEditorView;
        this.define({
            completions: [p.Array, []],
        });
    }
}
StringEditor.__name__ = "StringEditor";
StringEditor.init_StringEditor();
export class TextEditorView extends CellEditorView {
    _createInput() {
        return textarea();
    }
    renderEditor() {
        this.inputEl.focus();
        this.inputEl.select();
    }
}
TextEditorView.__name__ = "TextEditorView";
export class TextEditor extends CellEditor {
    static init_TextEditor() {
        this.prototype.default_view = TextEditorView;
    }
}
TextEditor.__name__ = "TextEditor";
TextEditor.init_TextEditor();
export class SelectEditorView extends CellEditorView {
    _createInput() {
        return select();
    }
    renderEditor() {
        for (const opt of this.model.options) {
            this.inputEl.appendChild(option({ value: opt }, opt));
        }
        this.focus();
    }
}
SelectEditorView.__name__ = "SelectEditorView";
export class SelectEditor extends CellEditor {
    static init_SelectEditor() {
        this.prototype.default_view = SelectEditorView;
        this.define({
            options: [p.Array, []],
        });
    }
}
SelectEditor.__name__ = "SelectEditor";
SelectEditor.init_SelectEditor();
export class PercentEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "text" });
    }
}
PercentEditorView.__name__ = "PercentEditorView";
export class PercentEditor extends CellEditor {
    static init_PercentEditor() {
        this.prototype.default_view = PercentEditorView;
    }
}
PercentEditor.__name__ = "PercentEditor";
PercentEditor.init_PercentEditor();
export class CheckboxEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "checkbox" });
    }
    renderEditor() {
        this.focus();
    }
    loadValue(item) {
        this.defaultValue = !!item[this.args.column.field];
        this.inputEl.checked = this.defaultValue;
    }
    serializeValue() {
        return this.inputEl.checked;
    }
}
CheckboxEditorView.__name__ = "CheckboxEditorView";
export class CheckboxEditor extends CellEditor {
    static init_CheckboxEditor() {
        this.prototype.default_view = CheckboxEditorView;
    }
}
CheckboxEditor.__name__ = "CheckboxEditor";
CheckboxEditor.init_CheckboxEditor();
export class IntEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "text" });
    }
    renderEditor() {
        //$(@inputEl).spinner({step: @model.step})
        this.inputEl.focus();
        this.inputEl.select();
    }
    remove() {
        //$(@inputEl).spinner("destroy")
        super.remove();
    }
    serializeValue() {
        return parseInt(this.getValue(), 10) || 0;
    }
    loadValue(item) {
        super.loadValue(item);
        this.inputEl.defaultValue = this.defaultValue;
        this.inputEl.select();
    }
    validateValue(value) {
        if (isNaN(value))
            return { valid: false, msg: "Please enter a valid integer" };
        else
            return super.validateValue(value);
    }
}
IntEditorView.__name__ = "IntEditorView";
export class IntEditor extends CellEditor {
    static init_IntEditor() {
        this.prototype.default_view = IntEditorView;
        this.define({
            step: [p.Number, 1],
        });
    }
}
IntEditor.__name__ = "IntEditor";
IntEditor.init_IntEditor();
export class NumberEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "text" });
    }
    renderEditor() {
        //$(@inputEl).spinner({step: @model.step})
        this.inputEl.focus();
        this.inputEl.select();
    }
    remove() {
        //$(@inputEl).spinner("destroy")
        super.remove();
    }
    serializeValue() {
        return parseFloat(this.getValue()) || 0.0;
    }
    loadValue(item) {
        super.loadValue(item);
        this.inputEl.defaultValue = this.defaultValue;
        this.inputEl.select();
    }
    validateValue(value) {
        if (isNaN(value))
            return { valid: false, msg: "Please enter a valid number" };
        else
            return super.validateValue(value);
    }
}
NumberEditorView.__name__ = "NumberEditorView";
export class NumberEditor extends CellEditor {
    static init_NumberEditor() {
        this.prototype.default_view = NumberEditorView;
        this.define({
            step: [p.Number, 0.01],
        });
    }
}
NumberEditor.__name__ = "NumberEditor";
NumberEditor.init_NumberEditor();
export class TimeEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "text" });
    }
}
TimeEditorView.__name__ = "TimeEditorView";
export class TimeEditor extends CellEditor {
    static init_TimeEditor() {
        this.prototype.default_view = TimeEditorView;
    }
}
TimeEditor.__name__ = "TimeEditor";
TimeEditor.init_TimeEditor();
export class DateEditorView extends CellEditorView {
    _createInput() {
        return input({ type: "text" });
    }
    get emptyValue() {
        return new Date();
    }
    renderEditor() {
        //this.calendarOpen = false
        //@$datepicker = $(@inputEl).datepicker({
        //  showOn: "button"
        //  buttonImageOnly: true
        //  beforeShow: () => @calendarOpen = true
        //  onClose: () => @calendarOpen = false
        //})
        //@$datepicker.siblings(".ui-datepicker-trigger").css("vertical-align": "middle")
        //@$datepicker.width(@$datepicker.width() - (14 + 2*4 + 4)) # img width + margins + edge distance
        this.inputEl.focus();
        this.inputEl.select();
    }
    destroy() {
        //$.datepicker.dpDiv.stop(true, true)
        //@$datepicker.datepicker("hide")
        //@$datepicker.datepicker("destroy")
        super.destroy();
    }
    show() {
        //if @calendarOpen
        //  $.datepicker.dpDiv.stop(true, true).show()
        super.show();
    }
    hide() {
        //if @calendarOpen
        //  $.datepicker.dpDiv.stop(true, true).hide()
        super.hide();
    }
    position( /*_position*/) {
        //if @calendarOpen
        //  $.datepicker.dpDiv.css(top: position.top + 30, left: position.left)
        return super.position();
    }
    getValue() {
        //return @$datepicker.datepicker("getDate").getTime()
    }
    setValue(_val) {
        //@$datepicker.datepicker("setDate", new Date(val))
    }
}
DateEditorView.__name__ = "DateEditorView";
export class DateEditor extends CellEditor {
    static init_DateEditor() {
        this.prototype.default_view = DateEditorView;
    }
}
DateEditor.__name__ = "DateEditor";
DateEditor.init_DateEditor();
//# sourceMappingURL=cell_editors.js.map