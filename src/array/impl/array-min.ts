import { _Debug } from "../../debug/_debug";

/**
 * @public
 * Find the smallest number in an array, if the array is empty the return is Infinity.
 *
 * @remarks
 * See {@link arrayMin}.
 */
export function arrayMin(numbers: ArrayLike<number>): number
{
    let min = Infinity;

    for (let i = 0, iEnd = numbers.length; i < iEnd; ++i)
    {
        const value = numbers[i];
        DEBUG_MODE && _Debug.assert(value === value, "NaN not supported");

        if (value < min)
        {
            min = value;
        }
    }

    return min;
}