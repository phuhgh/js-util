/**
 * @public
 * Does not check value equality, only key. Takes items from A.
 *
 * See {@link mapIntersect}.
 */
export function mapIntersect<TKey, TIem>
(
    a: ReadonlyMap<TKey, TIem>,
    b: ReadonlyMap<TKey, TIem>,
)
    : Map<TKey, TIem>
{
    const result = new Map<TKey, TIem>();

    a.forEach((item, key) =>
    {
        if (b.has(key))
        {
            result.set(key, item);
        }
    });

    return result;
}