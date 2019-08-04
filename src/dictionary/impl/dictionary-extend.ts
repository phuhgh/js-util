import { _Debug } from "../../debug/_debug";
import { arrayIsArray } from "../../array/impl/array-is-array";
import { IDictionary } from "../../i-dictionary";

export function dictionaryExtend<T extends object>(obj: T, extension: T): void
{
    DEBUG_MODE && _Debug.runBlock(() =>
    {
        _Debug.assert(!arrayIsArray(obj) && !arrayIsArray(extension), "should not be used with arrays");
    });

    const keys = Object.keys(extension);

    for (let i = 0, l = keys.length; i < l; ++i)
    {
        const key = keys[i];
        (obj as IDictionary<any>)[key] = (extension as IDictionary<any>)[key];
    }
}