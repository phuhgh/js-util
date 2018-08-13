import { IDictionary } from "../models/i-dictionary";
import { isArray } from "../debug/types/is-array";
import { Debug } from "../debug/debug";

export function extendObject(obj: object, extension: object): void
{
    DEBUG_MODE && Debug.runBlock(() =>
    {
        Debug.assert(!isArray(obj) && !isArray(extension), "should not be used with arrays");
    });

    const keys = Object.keys(extension);

    for (let i = 0, l = keys.length; i < l; ++i)
    {
        const key = keys[i];
        (obj as IDictionary<any>)[key] = (extension as IDictionary<any>)[key];
    }
}