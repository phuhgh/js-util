/**
 * @public
 * returns items in A not in B.
 *
 * @remarks
 * See {@link arraySetDifference}.
 */
export function arraySetDifference<TItem>
(
    a: ArrayLike<TItem>,
    b: Set<TItem>,
)
    : Set<TItem>
{
    const result = new Set<TItem>();

    for (let i = 0, iEnd = a.length; i < iEnd; ++i)
    {
        const item = a[i];

        if (!b.has(item))
        {
            result.add(item);
        }
    }

    return result;
}