import { IDictionary } from "../../typescript/i-dictionary";

export function dictionaryForEach<TDict extends IDictionary<any>, TKey extends keyof TDict>
(
    dictionary: TDict,
    callback: (item: TDict[TKey], key: TKey, dictionary: TDict) => void
)
    : void
{
    const keys = Object.keys(dictionary) as TKey[];

    for (let i = 0, iEnd = keys.length; i < iEnd; ++i)
    {
        const key = keys[i];
        callback(dictionary[key], key, dictionary);
    }
}