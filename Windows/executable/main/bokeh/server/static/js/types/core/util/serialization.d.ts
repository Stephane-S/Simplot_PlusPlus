import { ID } from "../types";
import { DataType, NDArray } from "./ndarray";
export declare function buffer_to_base64(buffer: ArrayBuffer): string;
export declare function base64_to_buffer(base64: string): ArrayBuffer;
export declare type ByteOrder = "little" | "big";
export declare const BYTE_ORDER: ByteOrder;
export declare function swap16(a: Int16Array | Uint16Array): void;
export declare function swap32(a: Int32Array | Uint32Array | Float32Array): void;
export declare function swap64(a: Float64Array): void;
export declare type Shape = number[];
export declare type BufferRef = {
    __buffer__: string;
    order: ByteOrder;
    dtype: DataType;
    shape: Shape;
};
export declare type NDArrayRef = {
    __ndarray__: string;
    order: ByteOrder;
    dtype: DataType;
    shape: Shape;
};
export declare function is_NDArray_ref(v: unknown): v is BufferRef | NDArrayRef;
export declare type Buffers = Map<ID, ArrayBuffer>;
export declare function decode_NDArray(ref: BufferRef | NDArrayRef, buffers: Buffers): NDArray;
export declare function encode_NDArray(array: NDArray, buffers?: Buffers): BufferRef | NDArrayRef;
