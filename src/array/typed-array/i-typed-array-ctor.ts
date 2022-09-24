/**
 * @public
 */
export interface ITypedArrayCtor<T>
{
    readonly prototype: T;
    new(length: number): T;
    new(array: ArrayLike<number> | ArrayBufferLike): T;
    new(buffer: ArrayBufferLike, byteOffset?: number, length?: number): T;
    readonly BYTES_PER_ELEMENT: number;
}