import { HasProps } from "../core/has_props";
export class DocumentEvent {
    constructor(document) {
        this.document = document;
    }
}
DocumentEvent.__name__ = "DocumentEvent";
export class DocumentEventBatch extends DocumentEvent {
    constructor(document, events, setter_id) {
        super(document);
        this.events = events;
        this.setter_id = setter_id;
    }
}
DocumentEventBatch.__name__ = "DocumentEventBatch";
export class DocumentChangedEvent extends DocumentEvent {
}
DocumentChangedEvent.__name__ = "DocumentChangedEvent";
export class MessageSentEvent extends DocumentChangedEvent {
    constructor(document, msg_type, msg_data) {
        super(document);
        this.msg_type = msg_type;
        this.msg_data = msg_data;
    }
    json(_references) {
        const value = this.msg_data;
        const value_json = HasProps._value_to_json(value);
        const value_refs = new Set();
        HasProps._value_record_references(value, value_refs, { recursive: true });
        /* XXX: this will cause all referenced models to be reinitialized
        for (const id in value_refs) {
          references[id] = value_refs[id]
        }
        */
        return {
            kind: "MessageSent",
            msg_type: this.msg_type,
            msg_data: value_json,
        };
    }
}
MessageSentEvent.__name__ = "MessageSentEvent";
export class ModelChangedEvent extends DocumentChangedEvent {
    constructor(document, model, attr, old, new_, setter_id, hint) {
        super(document);
        this.model = model;
        this.attr = attr;
        this.old = old;
        this.new_ = new_;
        this.setter_id = setter_id;
        this.hint = hint;
    }
    json(references) {
        if (this.attr === "id") {
            throw new Error("'id' field should never change, whatever code just set it is wrong");
        }
        if (this.hint != null)
            return this.hint.json(references);
        const value = this.new_;
        const value_json = HasProps._value_to_json(value);
        const value_refs = new Set();
        HasProps._value_record_references(value, value_refs, { recursive: true });
        if (value_refs.has(this.model) && this.model !== value) {
            // we know we don't want a whole new copy of the obj we're
            // patching unless it's also the value itself
            value_refs.delete(this.model);
        }
        for (const ref of value_refs) {
            references.add(ref);
        }
        return {
            kind: "ModelChanged",
            model: this.model.ref(),
            attr: this.attr,
            new: value_json,
        };
    }
}
ModelChangedEvent.__name__ = "ModelChangedEvent";
export class ColumnsPatchedEvent extends DocumentChangedEvent {
    constructor(document, column_source, patches) {
        super(document);
        this.column_source = column_source;
        this.patches = patches;
    }
    json(_references) {
        return {
            kind: "ColumnsPatched",
            column_source: this.column_source,
            patches: this.patches,
        };
    }
}
ColumnsPatchedEvent.__name__ = "ColumnsPatchedEvent";
export class ColumnsStreamedEvent extends DocumentChangedEvent {
    constructor(document, column_source, data, rollover) {
        super(document);
        this.column_source = column_source;
        this.data = data;
        this.rollover = rollover;
    }
    json(_references) {
        return {
            kind: "ColumnsStreamed",
            column_source: this.column_source,
            data: this.data,
            rollover: this.rollover,
        };
    }
}
ColumnsStreamedEvent.__name__ = "ColumnsStreamedEvent";
export class TitleChangedEvent extends DocumentChangedEvent {
    constructor(document, title, setter_id) {
        super(document);
        this.title = title;
        this.setter_id = setter_id;
    }
    json(_references) {
        return {
            kind: "TitleChanged",
            title: this.title,
        };
    }
}
TitleChangedEvent.__name__ = "TitleChangedEvent";
export class RootAddedEvent extends DocumentChangedEvent {
    constructor(document, model, setter_id) {
        super(document);
        this.model = model;
        this.setter_id = setter_id;
    }
    json(references) {
        HasProps._value_record_references(this.model, references, { recursive: true });
        return {
            kind: "RootAdded",
            model: this.model.ref(),
        };
    }
}
RootAddedEvent.__name__ = "RootAddedEvent";
export class RootRemovedEvent extends DocumentChangedEvent {
    constructor(document, model, setter_id) {
        super(document);
        this.model = model;
        this.setter_id = setter_id;
    }
    json(_references) {
        return {
            kind: "RootRemoved",
            model: this.model.ref(),
        };
    }
}
RootRemovedEvent.__name__ = "RootRemovedEvent";
//# sourceMappingURL=events.js.map