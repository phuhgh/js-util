import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Find the largest number in an array, if the array is empty the return is -Infinity.
 *
 * @remarks
 * See {@link arrayMax}.
 */
export function arrayMax(numbers: ArrayLike<number>): number
{
    let max = -Infinity;

    for (let i = 0, iEnd = numbers.length; i < iEnd; ++i)
    {
        const value = numbers[i];
        _BUILD.DEBUG && _Debug.assert(value === value, "NaN not supported");

        if (value > max)
        {
            max = value;
        }
    }

    return max;
}

