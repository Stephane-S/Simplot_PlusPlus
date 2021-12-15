import { Message } from "./message";
import { isString } from "../core/util/types";
export class Receiver {
    constructor() {
        this.message = null;
        this._partial = null;
        this._fragments = [];
        this._buf_header = null;
        this._current_consumer = this._HEADER;
    }
    consume(fragment) {
        this._current_consumer(fragment);
    }
    _HEADER(fragment) {
        this._assume_text(fragment);
        this.message = null;
        this._partial = null;
        this._fragments = [fragment];
        this._buf_header = null;
        this._current_consumer = this._METADATA;
    }
    _METADATA(fragment) {
        this._assume_text(fragment);
        this._fragments.push(fragment);
        this._current_consumer = this._CONTENT;
    }
    _CONTENT(fragment) {
        this._assume_text(fragment);
        this._fragments.push(fragment);
        const [header_json, metadata_json, content_json] = this._fragments.slice(0, 3);
        this._partial = Message.assemble(header_json, metadata_json, content_json);
        this._check_complete();
    }
    _BUFFER_HEADER(fragment) {
        this._assume_text(fragment);
        this._buf_header = fragment;
        this._current_consumer = this._BUFFER_PAYLOAD;
    }
    _BUFFER_PAYLOAD(fragment) {
        this._assume_binary(fragment);
        this._partial.assemble_buffer(this._buf_header, fragment);
        this._check_complete();
    }
    _assume_text(fragment) {
        if (!isString(fragment))
            throw new Error("Expected text fragment but received binary fragment");
    }
    _assume_binary(fragment) {
        if (!(fragment instanceof ArrayBuffer))
            throw new Error("Expected binary fragment but received text fragment");
    }
    _check_complete() {
        if (this._partial.complete()) {
            this.message = this._partial;
            this._current_consumer = this._HEADER;
        }
        else
            this._current_consumer = this._BUFFER_HEADER;
    }
}
Receiver.__name__ = "Receiver";
//# sourceMappingURL=receiver.js.map