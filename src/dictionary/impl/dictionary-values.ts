import { IDictionary } from "../../typescript/i-dictionary.js";

/**
 * @public
 * Equivalent to Object.values.
 *
 * @remarks
 * See {@link dictionaryValues}.
 */
export function dictionaryValues<T>(d: IDictionary<T>): T[]
{
    const keys = Object.keys(d);
    const l = keys.length;
    const a = new Array<T>(l);

    for (let i = 0; i < l; ++i)
    {
        a[i] = d[keys[i]];
    }

    return a;
}