import { ATypedArrayTuple } from "./a-typed-array-tuple.js";
import { TTypedArray } from "./t-typed-array.js";

/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
{
    createOne(...args: TCtorArgs): TArray;

    createOneEmpty(): TArray;
}
