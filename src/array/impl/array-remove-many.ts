/**
 * Removes each item in itemsToRemove from items (including any repeated items).
 */
export function arrayRemoveMany<TItem>(items: TItem[], itemsToRemove: TItem[]): void
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