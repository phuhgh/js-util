import { ATypedArrayTuple } from "./a-typed-array-tuple";
import { TTypedArray } from "./t-typed-array";

/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
{
    createOne(...args: TCtorArgs): TArray;

    createOneEmpty(): TArray;
}
