import { binaryFindInsertionIndex, TGetComparisonValueAtIndex } from "./binary-find-insertion-index.js";
import { fpIdentity } from "../../fp/impl/fp-identity.js";

/**
 * @public
 * Performs a bisection search of an 'indexable' object such that if the value were inserted, it would remain in order.
 * @param indexable - The thing to be searched. This must be sorted ascending.
 * @param comparisonValueToSearchFor - The comparison value to find the insertion index for.
 * @param getComparisonValueAtIndex - A function that provides the value for comparison at a given index.
 * @param length - The number of elements in the structure `indexable` to search.
 * @param start - The start index.
 * @returns The index to insert the element at, the highest value is the length of the array.
 *
 * @example
 * ```typescript
 * // searching for the number 2.5 with start index 1 & length 2
 *  const index = arrayBinaryFindInsertionIndex([1, 2, 3, 4], 2.5, (a, i) => a[i], 2, 1);
 *  // index is 2
 * ```
 *
 * @remarks
 * The `indexable` parameter must be sorted ascending. Where there are multiple equal values the lowest index will be returned.
 */
export function arrayBinaryFindInsertionIndex<T>
(
    indexable: T,
    comparisonValueToSearchFor: number,
    getComparisonValueAtIndex: TGetComparisonValueAtIndex<T>,
    length: number,
    start?: number,
)
{
    const index = binaryFindInsertionIndex(
        indexable,
        comparisonValueToSearchFor,
        getComparisonValueAtIndex,
        isLowGetLowest,
        fpIdentity,
        length,
        start
    );

    if (index === length - 1)
    {
        return comparisonValueToSearchFor > getComparisonValueAtIndex(indexable, index)
            ? length
            : index;
    }
    else
    {
        return index;
    }
}

function isLowGetLowest(comparisonValueToSearchFor: number, currentComparisonValue: number): boolean
{
    return currentComparisonValue < comparisonValueToSearchFor;
}