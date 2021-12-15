export class Buffer {
    constructor(gl) {
        this.gl = gl;
        this._usage = 35048;
        this.buffer_size = 0;
        this.handle = this.gl.createBuffer();
    }
    delete() {
        this.gl.deleteBuffer(this.handle);
    }
    activate() {
        this.gl.bindBuffer(this._target, this.handle);
    }
    deactivate() {
        this.gl.bindBuffer(this._target, null);
    }
    set_size(nbytes) {
        // Set the size of the buffer in bytes.
        //
        // Parameters
        // ----------
        // nbytes : int
        //     The number of bytes that the buffer needs to hold.
        if (nbytes != this.buffer_size) {
            this.activate();
            this.gl.bufferData(this._target, nbytes, this._usage);
            this.buffer_size = nbytes;
        }
    }
    set_data(offset, data) {
        // Set the buffer data.
        //
        // Parameters
        // ----------
        // offset : int
        //     The offset in bytes for the new data.
        // data : typed array
        //     The data to upload.
        this.activate();
        this.gl.bufferSubData(this._target, offset, data);
    }
}
Buffer.__name__ = "Buffer";
export class VertexBuffer extends Buffer {
    constructor() {
        super(...arguments);
        this._target = 34962;
    }
}
VertexBuffer.__name__ = "VertexBuffer";
export class IndexBuffer extends Buffer {
    constructor() {
        super(...arguments);
        this._target = 34963;
    }
}
IndexBuffer.__name__ = "IndexBuffer";
//# sourceMappingURL=buffer.js.map