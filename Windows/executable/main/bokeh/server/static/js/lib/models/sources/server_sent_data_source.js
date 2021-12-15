import { WebDataSource } from "./web_data_source";
export class ServerSentDataSource extends WebDataSource {
    constructor(attrs) {
        super(attrs);
        this.initialized = false;
    }
    destroy() {
        super.destroy();
    }
    setup() {
        if (!this.initialized) {
            this.initialized = true;
            const source = new EventSource(this.data_url);
            source.onmessage = (event) => {
                this.load_data(JSON.parse(event.data), this.mode, this.max_size);
            };
        }
    }
}
ServerSentDataSource.__name__ = "ServerSentDataSource";
//# sourceMappingURL=server_sent_data_source.js.map