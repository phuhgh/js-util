/**
 * @public
 *
 * @returns items in A not in B.
 */
export function mapSetDifference<TKey, TIem>
(
    a: ReadonlyMap<TKey, TIem>,
    b: ReadonlyMap<TKey, TIem>,
)
    : Map<TKey, TIem>
{
    const result = new Map<TKey, TIem>();

    a.forEach((item, key) =>
    {
        if (!b.has(key))
        {
            result.set(key, item);
        }
    });

    return result;
}