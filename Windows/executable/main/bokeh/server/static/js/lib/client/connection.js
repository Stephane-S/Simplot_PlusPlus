import { logger } from "../core/logging";
import { Document } from "../document";
import { Message } from "../protocol/message";
import { Receiver } from "../protocol/receiver";
import { ClientSession } from "./session";
export const DEFAULT_SERVER_WEBSOCKET_URL = "ws://localhost:5006/ws";
export const DEFAULT_TOKEN = "eyJzZXNzaW9uX2lkIjogImRlZmF1bHQifQ";
let _connection_count = 0;
export function parse_token(token) {
    let payload = token.split('.')[0];
    const mod = payload.length % 4;
    if (mod != 0)
        payload = payload + "=".repeat(4 - mod);
    return JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));
}
export class ClientConnection {
    constructor(url = DEFAULT_SERVER_WEBSOCKET_URL, token = DEFAULT_TOKEN, args_string = null) {
        this.url = url;
        this.token = token;
        this.args_string = args_string;
        this._number = _connection_count++;
        this.socket = null;
        this.session = null;
        this.closed_permanently = false;
        this._current_handler = null;
        this._pending_replies = new Map();
        this._pending_messages = [];
        this._receiver = new Receiver();
        this.id = parse_token(token).session_id.split('.')[0];
        logger.debug(`Creating websocket ${this._number} to '${this.url}' session '${this.id}'`);
    }
    async connect() {
        if (this.closed_permanently)
            throw new Error("Cannot connect() a closed ClientConnection");
        if (this.socket != null)
            throw new Error("Already connected");
        this._current_handler = null;
        this._pending_replies.clear();
        this._pending_messages = [];
        try {
            let versioned_url = `${this.url}`;
            if (this.args_string != null && this.args_string.length > 0)
                versioned_url += `?${this.args_string}`;
            this.socket = new WebSocket(versioned_url, ["bokeh", this.token]);
            return new Promise((resolve, reject) => {
                // "arraybuffer" gives us binary data we can look at;
                // if we just needed an opaque blob we could use "blob"
                this.socket.binaryType = "arraybuffer";
                this.socket.onopen = () => this._on_open(resolve, reject);
                this.socket.onmessage = (event) => this._on_message(event);
                this.socket.onclose = (event) => this._on_close(event, reject);
                this.socket.onerror = () => this._on_error(reject);
            });
        }
        catch (error) {
            logger.error(`websocket creation failed to url: ${this.url}`);
            logger.error(` - ${error}`);
            throw error;
        }
    }
    close() {
        if (!this.closed_permanently) {
            logger.debug(`Permanently closing websocket connection ${this._number}`);
            this.closed_permanently = true;
            if (this.socket != null)
                this.socket.close(1000, `close method called on ClientConnection ${this._number}`);
            this.session._connection_closed();
        }
    }
    _schedule_reconnect(milliseconds) {
        const retry = () => {
            // TODO commented code below until we fix reconnection to repull
            // the document when required. Otherwise, we get a lot of
            // confusing errors that are causing trouble when debugging.
            /*
            if (this.closed_permanently) {
            */
            if (!this.closed_permanently)
                logger.info(`Websocket connection ${this._number} disconnected, will not attempt to reconnect`);
            return;
            /*
            } else {
              logger.debug(`Attempting to reconnect websocket ${this._number}`)
              this.connect()
            }
            */
        };
        setTimeout(retry, milliseconds);
    }
    send(message) {
        if (this.socket == null)
            throw new Error(`not connected so cannot send ${message}`);
        message.send(this.socket);
    }
    async send_with_reply(message) {
        const reply = await new Promise((resolve, reject) => {
            this._pending_replies.set(message.msgid(), { resolve, reject });
            this.send(message);
        });
        if (reply.msgtype() === "ERROR")
            throw new Error(`Error reply ${reply.content.text}`);
        else
            return reply;
    }
    async _pull_doc_json() {
        const message = Message.create("PULL-DOC-REQ", {});
        const reply = await this.send_with_reply(message);
        if (!("doc" in reply.content))
            throw new Error("No 'doc' field in PULL-DOC-REPLY");
        return reply.content.doc;
    }
    async _repull_session_doc(resolve, reject) {
        var _a;
        logger.debug(this.session ? "Repulling session" : "Pulling session for first time");
        try {
            const doc_json = await this._pull_doc_json();
            if (this.session == null) {
                if (this.closed_permanently) {
                    logger.debug("Got new document after connection was already closed");
                    reject(new Error("The connection has been closed"));
                }
                else {
                    const document = Document.from_json(doc_json);
                    // Constructing models changes some of their attributes, we deal with that
                    // here. This happens when models set attributes during construction
                    // or initialization.
                    const patch = Document._compute_patch_since_json(doc_json, document);
                    if (patch.events.length > 0) {
                        logger.debug(`Sending ${patch.events.length} changes from model construction back to server`);
                        const patch_message = Message.create('PATCH-DOC', {}, patch);
                        this.send(patch_message);
                    }
                    this.session = new ClientSession(this, document, this.id);
                    for (const msg of this._pending_messages) {
                        this.session.handle(msg);
                    }
                    this._pending_messages = [];
                    logger.debug("Created a new session from new pulled doc");
                    resolve(this.session);
                }
            }
            else {
                this.session.document.replace_with_json(doc_json);
                logger.debug("Updated existing session with new pulled doc");
                // Since the session already exists, we don't need to call `resolve` again.
            }
        }
        catch (error) {
            (_a = console.trace) === null || _a === void 0 ? void 0 : _a.call(console, error);
            logger.error(`Failed to repull session ${error}`);
            reject(error);
        }
    }
    _on_open(resolve, reject) {
        logger.info(`Websocket connection ${this._number} is now open`);
        this._current_handler = (message) => {
            this._awaiting_ack_handler(message, resolve, reject);
        };
    }
    _on_message(event) {
        if (this._current_handler == null)
            logger.error("Got a message with no current handler set");
        try {
            this._receiver.consume(event.data);
        }
        catch (e) {
            this._close_bad_protocol(e.toString());
        }
        const msg = this._receiver.message;
        if (msg != null) {
            const problem = msg.problem();
            if (problem != null)
                this._close_bad_protocol(problem);
            this._current_handler(msg);
        }
    }
    _on_close(event, reject) {
        logger.info(`Lost websocket ${this._number} connection, ${event.code} (${event.reason})`);
        this.socket = null;
        this._pending_replies.forEach((pr) => pr.reject("Disconnected"));
        this._pending_replies.clear();
        if (!this.closed_permanently)
            this._schedule_reconnect(2000);
        reject(new Error(`Lost websocket connection, ${event.code} (${event.reason})`));
    }
    _on_error(reject) {
        logger.debug(`Websocket error on socket ${this._number}`);
        const msg = "Could not open websocket";
        logger.error(`Failed to connect to Bokeh server: ${msg}`);
        reject(new Error(msg));
    }
    _close_bad_protocol(detail) {
        logger.error(`Closing connection: ${detail}`);
        if (this.socket != null)
            this.socket.close(1002, detail); // 1002 = protocol error
    }
    _awaiting_ack_handler(message, resolve, reject) {
        if (message.msgtype() === "ACK") {
            this._current_handler = (message) => this._steady_state_handler(message);
            // Reload any sessions
            this._repull_session_doc(resolve, reject);
        }
        else
            this._close_bad_protocol("First message was not an ACK");
    }
    _steady_state_handler(message) {
        const reqid = message.reqid();
        const pr = this._pending_replies.get(reqid);
        if (pr) {
            this._pending_replies.delete(reqid);
            pr.resolve(message);
        }
        else if (this.session) {
            this.session.handle(message);
        }
        else if (message.msgtype() != 'PATCH-DOC') {
            // This branch can be executed only before we get the document.
            // When we get the document, all of the patches will already be incorporated.
            // In general, it's not possible to apply patches received before the document,
            // since they may change some models that were removed before serving the document.
            this._pending_messages.push(message);
        }
    }
}
ClientConnection.__name__ = "ClientConnection";
export function pull_session(url, token, args_string) {
    const connection = new ClientConnection(url, token, args_string);
    return connection.connect();
}
//# sourceMappingURL=connection.js.map