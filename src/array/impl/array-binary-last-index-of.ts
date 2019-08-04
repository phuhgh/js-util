import { binaryFindInsertionIndex, TGetComparisonValueAtIndex } from "./binary-find-insertion-index";

export function arrayBinaryLastIndexOf<T>(
    indexable: T,
    comparisonValueToSearchFor: number,
    getComparisonValueAtIndex: TGetComparisonValueAtIndex<T>,
    length: number,
    startIndex?: number,
): number
{
    const index = binaryFindInsertionIndex(
        indexable,
        comparisonValueToSearchFor,
        getComparisonValueAtIndex,
        isLowGetHighest,
        (v) => v -1,
        length,
        startIndex
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


function isLowGetHighest(comparisonValueToSearchFor: number, currentComparisonValue: number): boolean
{
    return currentComparisonValue <= comparisonValueToSearchFor;
}
