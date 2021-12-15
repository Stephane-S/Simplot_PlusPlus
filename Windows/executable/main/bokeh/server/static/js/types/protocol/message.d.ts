export declare type Socket = {
    send(data: unknown): void;
};
export declare type Header = {
    msgid?: string;
    msgtype?: string;
    reqid?: string;
    num_buffers?: number;
};
export declare class Message {
    readonly header: Header;
    readonly metadata: any;
    readonly content: any;
    readonly buffers: Map<string, ArrayBuffer>;
    private constructor();
    static assemble(header_json: string, metadata_json: string, content_json: string): Message;
    assemble_buffer(buf_header: string, buf_payload: ArrayBuffer): void;
    static create(msgtype: string, metadata: any, content?: any): Message;
    static create_header(msgtype: string): Header;
    complete(): boolean;
    send(socket: Socket): void;
    msgid(): string;
    msgtype(): string;
    reqid(): string;
    problem(): string | null;
}
