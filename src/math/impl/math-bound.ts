import { _Debug } from "../../debug/_debug";

/**
 * @public
 * Bound a value in to a range.
 *
 * @returns The `value` if it lies between `min` and `max`, otherwise `min` if smaller and `max` if greater.
 *
 * @remarks
 * NaN input will cause a debug error.
 *
 * See {@link mathBound}.
 */
export function mathBound(value: number, min: number, max: number): number
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(!isNaN(value), "expected value to be a number");
        _Debug.assert(!isNaN(min), "expected min to be a number");
        _Debug.assert(!isNaN(max), "expected max to be a number");
        _Debug.assert(max >= min, "expected max to be greater than or equal to min");
    });

    if (value > max)
    {
        return max;
    }

    if (value < min)
    {
        return min;
    }

    return value;
}