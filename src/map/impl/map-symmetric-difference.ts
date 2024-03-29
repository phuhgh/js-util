/**
 * @public
 *  Returns a map with keys in A not in B, and keys in B not in A.
 *
 * @remarks
 * See {@link mapSymmetricDifference}.
 */
export function mapSymmetricDifference<TKey, TIem>
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

    b.forEach((item, key) =>
    {
        if (!a.has(key))
        {
            result.set(key, item);
        }
    });

    return result;
}