/**
 * @public
 * Replaces the first match of itemToRemove with replaceWith.
 *
 * @remarks
 * See {@link arrayReplaceOne}.
 */
export function arrayReplaceOne<TItem>(items: TItem[], itemToRemove: TItem, replaceWith: TItem): void
{
    const index = items.indexOf(itemToRemove);

    if (index === -1)
    {
        return;
    }

    items[index] = replaceWith;
}