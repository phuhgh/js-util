/**
 * @public
 * Removes either 0 or one item from items, even if itemToRemove appears more than once.
 *
 * @returns true if an item was removed.
 *
 * @remarks
 * The lowest indexed item will be removed where there is more than one match.
 *
 * See {@link arrayRemoveOne}.
 */
export function arrayRemoveOne<TItem>(items: TItem[], itemToRemove: TItem): boolean
{
    const index = items.indexOf(itemToRemove);

    if (index === -1)
    {
        return false;
    }

    items.splice(index, 1);

    return true;
}