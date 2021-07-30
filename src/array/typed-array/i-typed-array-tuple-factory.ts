import { ATypedArrayTuple } from "./a-typed-array-tuple";
import { TTypedArray } from "./t-typed-array";
import { TExtractTypeTypedArrayTuple } from "../../typescript/t-extract-type-typed-array-tuple";

/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
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
        writeFrom: Readonly<TArray>,
        pointer: number,
        littleEndian?: boolean,
    )
        : void;

    clone(typedArrayTuple: Readonly<TArray>): TArray;

    /**
     * Although the typed array tuples extend a typed array, they are not considered structurally compatible by typescript.
     * This function returns the argument passed without modification but cast as the underlying storage type, e.g. Float32Array.
     */
    castToBaseType(typedArrayTuple: Readonly<TArray>): TExtractTypeTypedArrayTuple<TArray>;
}