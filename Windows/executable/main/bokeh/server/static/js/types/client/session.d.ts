import { Document, DocumentEvent } from "../document";
import { Message } from "../protocol/message";
import { ClientConnection } from "./connection";
export declare class ClientSession {
    protected readonly _connection: ClientConnection;
    readonly document: Document;
    readonly id: string;
    protected _document_listener: (event: DocumentEvent) => void;
    constructor(_connection: ClientConnection, document: Document, id: string);
    handle(message: Message): void;
    close(): void;
    _connection_closed(): void;
    request_server_info(): Promise<unknown>;
    force_roundtrip(): Promise<void>;
    protected _document_changed(event: DocumentEvent): void;
    protected _handle_patch(message: Message): void;
    protected _handle_ok(message: Message): void;
    protected _handle_error(message: Message): void;
}
