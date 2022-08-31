/**
 * @public
 * converts objects into key value pair tuples.
 *
 * @remarks
 * See {@link dictionaryPairs}.
 */
export function dictionaryPairs<TKey extends string | number | symbol, TValue>
(
    dictionary: { [index in TKey]: TValue },
)
    : [TKey, TValue][]
{
    const keys = Object.keys(dictionary) as TKey[];
    const pairs = new Array<[TKey, TValue]>(keys.length);

    for (let i = 0, iEnd = keys.length; i < iEnd; ++i)
    {
        const key = keys[i];
        pairs[i] = [key, dictionary[key]];
    }

    return pairs;
}