import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Returns the larger of the two parameters `a` and `b`.
 *
 * @remarks
 * NaN input will cause a debug error.
 * Differs from Math.max by taking only 2 arguments, avoids overhead of handling variable number of arguments.
 *
 * See {@link mathMax}.
 */
export function mathMax(a: number, b: number): number
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(!isNaN(a), "expected a to be a number");
        _Debug.assert(!isNaN(b), "expected b to be a number");
    });

    if (a > b)
    {
        return a;
    }

    return b;
}