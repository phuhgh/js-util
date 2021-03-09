/**
 * @public
 */
export interface ITypedArrayTupleFactory<TBuffer, TCtorArgs extends unknown[]>
{
    createOne(...args: TCtorArgs): TBuffer;

    createOneEmpty(): TBuffer;

    copyFromBuffer
    (
        bufferView: DataView,
        mat2Ptr: number,
        writeTo?: TBuffer
    )
        : TBuffer;

    copyToBuffer
    (
        bufferView: DataView,
        writeFrom: TBuffer,
        mat2Ptr: number
    )
        : void
}