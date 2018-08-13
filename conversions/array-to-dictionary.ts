import { TIndexableProp } from "../models/t-indexable-prop";
import { IDictionary } from "../models/i-dictionary";
import { Debug } from "../debug/debug";

export function arrayToDictionary<T extends object, TKey extends keyof T, TProp extends TIndexableProp<T, TKey>>(
    a: T[],
    keyOn: TKey,
    allowDuplicates?: boolean,
): IDictionary<T>
{
    DEBUG_MODE && Debug.runBlock(() =>
    {
        const keysIHaveSeenBefore: IDictionary<true | undefined> = {};

        for (let i = 0, l = a.length; i < l; ++i)
        {
            const key = a[i][keyOn] as TIndexableProp<T, TKey>;
            Debug.assert(key != null, "DEBUG: do not use null / undefined as a key");

            if (allowDuplicates == null || allowDuplicates === false)
            {
                Debug.assert(keysIHaveSeenBefore[key] == null, "DEBUG: key appeared more than once");
                keysIHaveSeenBefore[key] = true;
            }
        }
    });

    const d: IDictionary<T> = {};

    for (let i = 0, l = a.length; i < l; ++i)
    {
        const element = a[i];
        d[element[keyOn] as TIndexableProp<T, TKey>] = element;
    }

    return d;
}