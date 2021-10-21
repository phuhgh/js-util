/**
 * @public
 * Creates a new array with no duplicates, using standard object equality.
 *
 * @remarks
 * See {@link arrayUnique}.
 */
export function arrayUnique<TItem>
(
    items: ArrayLike<TItem>,
)
    : TItem[]
{
    const collected = new Set<TItem>();

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        collected.add(items[i]);
    }

    return Array.from(collected);
}
