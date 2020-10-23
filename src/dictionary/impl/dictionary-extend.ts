import { _Debug } from "../../debug/_debug";
import { arrayIsArray } from "../../array/impl/array-is-array";
import { IDictionary } from "../../typescript/i-dictionary";

/**
 * Apply extension to base (mutative)
 */
export function dictionaryExtend<T extends object>(base: T, extension: T): void
{
    DEBUG_MODE && _Debug.runBlock(() =>
    {
        _Debug.assert(!arrayIsArray(base) && !arrayIsArray(extension), "should not be used with arrays");
    });

    const keys = Object.keys(extension);

    for (let i = 0, l = keys.length; i < l; ++i)
    {
        const key = keys[i];
        (base as IDictionary<any>)[key] = (extension as IDictionary<any>)[key];
    }
}