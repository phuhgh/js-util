/**
 * @public
 * Replaces the first match of itemToRemove with replaceWith.
 *
 * @returns true if an element was replaced.
 *
 * @remarks
 * See {@link arrayReplaceOne}.
 */
export function arrayReplaceOne<TItem>(items: TItem[], itemToRemove: TItem, replaceWith: TItem): boolean
{
    const index = items.indexOf(itemToRemove);

    if (index === -1)
    {
        return false;
    }

    items[index] = replaceWith;

    return true;
}