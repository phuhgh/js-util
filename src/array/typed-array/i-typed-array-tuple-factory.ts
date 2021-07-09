/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TArray, TCtorArgs extends number[]>
{
    createOne(...args: TCtorArgs): TArray;

    createOneEmpty(): TArray;

    copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo?: TArray,
        littleEndian?: boolean,
    )
        : TArray;

    copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: TArray,
        pointer: number,
        littleEndian?: boolean,
    )
        : void;

    clone(typedArrayTuple: TArray): TArray;
}