import { binaryFindInsertionIndex, TGetComparisonValueAtIndex } from "./binary-find-insertion-index";

export function arrayBinaryIndexOf<T>(
    indexable: T,
    comparisonValueToSearchFor: number,
    getComparisonValueAtIndex: TGetComparisonValueAtIndex<T>,
    length: number,
    start?: number,
): number
{
    const index = binaryFindInsertionIndex(
        indexable,
        comparisonValueToSearchFor,
        getComparisonValueAtIndex,
        isLowGetLowest,
        (v) => v,
        length,
        start,
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

function isLowGetLowest(comparisonValueToSearchFor: number, currentComparisonValue: number): boolean
{
    return currentComparisonValue < comparisonValueToSearchFor;
}