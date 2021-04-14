/**
 * Removes either 0 or one item from items, even if itemToRemove appears more than once.
 * The lowest indexed item will be removed where there is more than one match.
 */
export function arrayRemoveOne<TItem>(items: TItem[], itemToRemove: TItem): void
{
    const index = items.indexOf(itemToRemove);

    if (index === -1)
    {
        return;
    }

    items.splice(index, 1);
}