/**
 * @public
 * Populates a `Map` given a property to lookup by name.
 *
 * See {@link arrayIndexBy}.
 */
export function arrayIndexBy<TName extends keyof TItem, TItem extends object>
(
    items: ArrayLike<TItem>,
    propertyName: TName,
)
    : Map<TItem[TName], TItem>
{
    const indexed = new Map<TItem[TName], TItem>();

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const item = items[i];
        indexed.set(item[propertyName], item);
    }

    return indexed;
}