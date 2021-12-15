import { IndexBuffer, VertexBuffer } from "./buffer";
import { Texture2d } from "./texture";
export declare class Program {
    readonly gl: WebGLRenderingContext;
    UTYPEMAP: {
        [key: string]: string;
    };
    ATYPEMAP: {
        [key: string]: string;
    };
    ATYPEINFO: {
        [key: string]: [number, number];
    };
    readonly handle: WebGLProgram;
    protected _linked: boolean;
    protected _validated: boolean;
    protected _unset_variables: Set<string>;
    protected _known_invalid: Set<string>;
    protected _locations: Map<string, number>;
    readonly _samplers: Map<string, [number, WebGLTexture, number]>;
    readonly _attributes: Map<string, [WebGLBuffer | null, number, string, unknown[]]>;
    constructor(gl: WebGLRenderingContext);
    delete(): void;
    activate(): void;
    deactivate(): void;
    set_shaders(vert: string, frag: string): void;
    _get_active_attributes_and_uniforms(): Set<string>;
    set_texture(name: string, value: Texture2d): void;
    set_uniform(name: string, type_: string, value: number[]): void;
    set_attribute(name: string, type_: string, value: VertexBuffer | number[], stride?: number, offset?: number): void;
    _pre_draw(): void;
    _validate(): void;
    draw(mode: GLenum, selection: IndexBuffer | [GLint, GLsizei]): void;
}
