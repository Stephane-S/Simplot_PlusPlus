import { uniqueId } from "../core/util/string";
export class Message {
    constructor(header, metadata, content) {
        this.header = header;
        this.metadata = metadata;
        this.content = content;
        this.buffers = new Map();
    }
    static assemble(header_json, metadata_json, content_json) {
        const header = JSON.parse(header_json);
        const metadata = JSON.parse(metadata_json);
        const content = JSON.parse(content_json);
        return new Message(header, metadata, content);
    }
    assemble_buffer(buf_header, buf_payload) {
        const nb = this.header.num_buffers != null ? this.header.num_buffers : 0;
        if (nb <= this.buffers.size)
            throw new Error(`too many buffers received, expecting ${nb}`);
        const { id } = JSON.parse(buf_header);
        this.buffers.set(id, buf_payload);
    }
    // not defined for BokehJS, only *receiving* buffers is supported
    // add_buffer: (buf_header, buf_payload) ->
    // write_buffers: (socket)
    static create(msgtype, metadata, content = {}) {
        const header = Message.create_header(msgtype);
        return new Message(header, metadata, content);
    }
    static create_header(msgtype) {
        return {
            msgid: uniqueId(),
            msgtype,
        };
    }
    complete() {
        if (this.header != null && this.metadata != null && this.content != null) {
            if (this.header.num_buffers != undefined)
                return this.buffers.size == this.header.num_buffers;
            else
                return true;
        }
        else
            return false;
    }
    send(socket) {
        const nb = this.header.num_buffers != null ? this.header.num_buffers : 0;
        if (nb > 0)
            throw new Error("BokehJS only supports receiving buffers, not sending");
        const header_json = JSON.stringify(this.header);
        const metadata_json = JSON.stringify(this.metadata);
        const content_json = JSON.stringify(this.content);
        socket.send(header_json);
        socket.send(metadata_json);
        socket.send(content_json);
    }
    msgid() {
        return this.header.msgid;
    }
    msgtype() {
        return this.header.msgtype;
    }
    reqid() {
        return this.header.reqid;
    }
    // return the reason we should close on bad protocol, if there is one
    problem() {
        if (!('msgid' in this.header))
            return "No msgid in header";
        else if (!('msgtype' in this.header))
            return "No msgtype in header";
        else
            return null;
    }
}
Message.__name__ = "Message";
//# sourceMappingURL=message.js.map