import { binaryFindInsertionIndex, TGetComparisonValueAtIndex } from "./binary-find-insertion-index.js";

/**
 * @public
 * Performs a bisection search of an 'indexable' object, i.e. can be accessed by index, for example `Array`. Custom data structures are also supported.
 * @param indexable - The thing to be searched. This must be sorted ascending.
 * @param comparisonValueToSearchFor - The comparison value which is being searched for.
 * @param getComparisonValueAtIndex - A function that provides the value for comparison at a given index.
 * @param length - The number of elements in the structure `indexable` to search.
 * @param start - The start index.
 * @returns The index of the searched for item, else -1 if it cannot be found.
 *
 * @example
 * ```typescript
 * // searching for the number 3 with start index 1 & length 2
 *  const index = arrayBinaryIndexOf([1, 2, 3, 4], 3, (a, i) => a[i], 2, 1);
 *  // index is 2
 * ```
 *
 * @remarks
 * The `indexable` parameter must be sorted ascending. Where there are multiple equal values the highest index will be returned.
 *
 * See {@link arrayBinaryLastIndexOf}.
 */
export function arrayBinaryLastIndexOf<T>
(
    indexable: T,
    comparisonValueToSearchFor: number,
    getComparisonValueAtIndex: TGetComparisonValueAtIndex<T>,
    length: number,
    start?: number,
)
    : number
{
    const index = binaryFindInsertionIndex(
        indexable,
        comparisonValueToSearchFor,
        getComparisonValueAtIndex,
        isLowGetHighest,
        adjustValue,
        length,
        start
    );

    if (getComparisonValueAtIndex(indexable, index) === comparisonValueToSearchFor)
    {
        return index;
    }
    else
    {
        return -1;
    }
}

function adjustValue(v: number) {
    return v - 1;
}

function isLowGetHighest(comparisonValueToSearchFor: number, currentComparisonValue: number): boolean
{
    return currentComparisonValue <= comparisonValueToSearchFor;
}
