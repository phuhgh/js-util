import { _Debug } from "../../debug/_debug.js";
import { mathBound } from "../../math/impl/math-bound.js";

/**
 * @public
 */
export type TGetComparisonValueAtIndex<T> = (indexable: T, index: number) => number;

/**
 * @internal
 */
export function binaryFindInsertionIndex<T>
(
    indexable: T,
    comparisonValueToSearchFor: number,
    getComparisonValueAtIndex: TGetComparisonValueAtIndex<T>,
    isLow: (comparisonValueToSearchFor: number, currentComparisonValue: number) => boolean,
    adjustValue: (value: number) => number,
    length: number,
    startIndex: number = 0,
)
    : number
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(startIndex < length, "start index must be within bounds");

        let prev = -Infinity;
        _Debug.assert(comparisonValueToSearchFor === comparisonValueToSearchFor, "NaN is not a permissible comparison value");

        if (!_Debug.isFlagSet("DISABLE_EXPENSIVE_CHECKS"))
        {
            for (let i = startIndex; i < length; ++i)
            {
                const current = getComparisonValueAtIndex(indexable, i);
                _Debug.assert(current === current, "NaN is not a permissible comparison value");
                _Debug.assert(current >= prev, "expected data to be sorted");
                prev = current;
            }
        }
    });

    let low = startIndex;
    let high = length;

    while (low < high)
    {
        const midIndex = (low + high) >> 1;
        const currentComparisonValue = getComparisonValueAtIndex(indexable, midIndex);

        // i.e. the comparison value is less than the value we're searching for
        if (isLow(comparisonValueToSearchFor, currentComparisonValue))
        {
            low = midIndex + 1;
        }
        else
        {
            high = midIndex;
        }
    }

    return mathBound(adjustValue(high), startIndex, length - 1);
}