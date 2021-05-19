import { _Debug } from "../../debug/_debug";

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
    DEBUG_MODE && _Debug.runBlock(() =>
    {
        _Debug.assert(to >= from, "to must be greater than or equal to from");
        _Debug.assert(!isNaN(from) && !isNaN(to), "NaN range not supported");
    });
    const length = to - from + 1;
    const array = new Array<TMapped>(length);

    for (let i = 0; i < length; ++i)
    {
        array[i] = callback(from++, i);
    }

    return array;
}