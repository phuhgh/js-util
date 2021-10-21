/**
 * @public
 * Adds the items in an array to the set.
 *
 * @remarks
 * See {@link arrayAddToSet}.
 */
export function arrayAddToSet<TItem>
(
    items: ArrayLike<TItem>,
    set: Set<TItem>
)
    : void
{
    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        set.add(items[i]);
    }
}
