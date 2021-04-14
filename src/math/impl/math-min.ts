import { _Debug } from "../../debug/_debug";

/**
 * @public
 * Returns the smaller of the two parameters `a` and `b`.
 *
 * @remarks
 * NaN comparison will cause a debug error.
 * Differs from Math.min by taking only 2 arguments, avoids overhead of handling variable number of arguments.
 *
 * See {@link mathMin}.
 */
export function mathMin(a: number, b: number): number
{
    DEBUG_MODE && _Debug.runBlock(() =>
    {
        _Debug.assert(!isNaN(a), "expected a to be a number");
        _Debug.assert(!isNaN(b), "expected b to be a number");
    });

    if (a > b)
    {
        return b;
    }

    return a;
}