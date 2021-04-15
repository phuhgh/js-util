/**
 * @public
 * Removes each item in `itemsToRemove` from `items` (including any repeated items).
 * @remarks
 * See {@link arrayRemoveMany}.
 */
export function arrayRemoveMany<TItem>(items: TItem[], itemsToRemove: readonly TItem[]): void
{
    const setOfItemsToRemove = new Set(itemsToRemove);
    let index = items.length;

    while (index-- > 0)
    {
        if (setOfItemsToRemove.has(items[index]))
        {
            items.splice(index, 1);
        }
    }
}