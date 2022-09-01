import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Like {@link arrayMap} with integer range as input.
 *
 * @param from - The value to start from (inclusive).
 * @param to - The value to finish with (inclusive).
 * @param callback - Called for each value in the range.
 *
 * @returns An array of results from the callback.
 *
 * @remarks
 * Where `from` and `to` are equal a length 1 array is returned, NaN input is not supported.
 *
 * See {@link arrayMapRange}.
 */
export function arrayMapRange<TMapped>(from: number, to: number, callback: (value: number, index: number) => TMapped): TMapped[]
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(!isNaN(from) && !isNaN(to), "NaN range not supported");
    });
    const range = to - from;
    const length = Math.abs(range) + 1;
    const increment = Math.sign(range);
    const array = new Array<TMapped>(length);

    for (let i = 0; i < length; ++i)
    {
        array[i] = callback(from, i);
        from += increment;
    }

    return array;
}