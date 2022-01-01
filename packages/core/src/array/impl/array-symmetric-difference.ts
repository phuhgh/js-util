/**
 * @public
 * Returns those items in A not in B, and those items in B not in A.
 *
 * @remarks
 * See {@link arraySymmetricDifference}.
 */
export function arraySymmetricDifference<TItem>
(
    a: readonly TItem[],
    b: readonly TItem[],
    aSet: ReadonlySet<TItem> = new Set(a),
    bSet: ReadonlySet<TItem> = new Set(b),
)
    : Set<TItem>
{
    const result = new Set<TItem>();

    for (let i = 0, iEnd = a.length; i < iEnd; ++i)
    {
        const item = a[i];

        if (!bSet.has(item))
        {
            result.add(item);
        }
    }

    for (let i = 0, iEnd = b.length; i < iEnd; ++i)
    {
        const item = b[i];

        if (!aSet.has(item))
        {
            result.add(item);
        }
    }

    return result;
}