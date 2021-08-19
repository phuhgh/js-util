/**
 * @public
 * Removes each item in `itemsToRemove` from `items` (including any repeated items).
 *
 * @returns The number of items that were removed.
 *
 * @remarks
 * See {@link arrayRemoveMany}.
 */
export function arrayRemoveMany<TItem>(items: TItem[], itemsToRemove: readonly TItem[]): number
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

    return setOfItemsToRemove.size;
}