/**
 * Produce key values for a given array, keys which are null are omitted.
 */
export function arrayIndex<TKey, TItem>
(
    items: ArrayLike<TItem>,
    getKey: (item: TItem, index: number) => TKey
)
    : Map<Exclude<TKey, null>, TItem>
{
    const indexed = new Map<Exclude<TKey, null>, TItem>();

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const item = items[i];
        const key = getKey(item, i);

        if (key !== null)
        {
            indexed.set(key as Exclude<TKey, null>, item);
        }
    }

    return indexed;
}