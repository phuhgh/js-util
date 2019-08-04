import { _Debug } from "../../debug/_debug";
import { IDictionary } from "../../i-dictionary";
import { TIndexableProp } from "../../t-indexable-prop";

export function arrayIndexByKey<T extends object, TKey extends keyof T>(
    a: T[],
    keyOn: TKey,
    allowDuplicates?: boolean,
): IDictionary<T>
{
    DEBUG_MODE && _Debug.runBlock(() =>
    {
        const keysIHaveSeenBefore: IDictionary<true | undefined> = {};

        for (let i = 0, l = a.length; i < l; ++i)
        {
            const key = a[i][keyOn] as TIndexableProp<T, TKey>;
            _Debug.assert(key != null, "DEBUG: do not use null / undefined as a key");

            if (allowDuplicates == null || !allowDuplicates)
            {
                _Debug.assert(keysIHaveSeenBefore[key] == null, "DEBUG: key appeared more than once");
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