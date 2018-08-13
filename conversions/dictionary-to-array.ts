import { IDictionary } from "../models/i-dictionary";

export function dictionaryToArray<T>(d: IDictionary<T>): T[]
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