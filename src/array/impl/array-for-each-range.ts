import { _Debug } from "../../debug/_debug";

/**
 * @public
 * Like {@link arrayForEach} with integer range as input.
 *
 * @param from - The value to start from (inclusive).
 * @param to - The value to finish with (inclusive).
 * @param callback - Called for each value in the range.
 *
 * @remarks
 * Where `from` and `to` are equal a length 1 array is returned, NaN input is not supported.
 *
 * See {@link arrayForEachRange}.
 */
export function arrayForEachRange(from: number, to: number, callback: (value: number, index: number) => void): void
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(!isNaN(from) && !isNaN(to), "NaN range not supported");
    });
    const range = to - from;
    const increment = Math.sign(range);

    for (let i = 0; i < Math.abs(range) + 1; ++i)
    {
        callback(from, i);
        from += increment;
    }
}