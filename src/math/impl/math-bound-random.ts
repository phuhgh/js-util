import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Create a random value between min and max.
 *
 * @remarks
 * NaN input will cause a debug error. Max greater than min will cause a debug error.
 *
 * See {@link mathBoundRandom}.
 */
export function mathBoundRandom(min: number, max: number): number
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(min < max, "min must be smaller than max");
        _Debug.assert(!isNaN(min) && !isNaN(max), "nan input not supported");
    });

    return Math.random() * (max - min) + min;
}