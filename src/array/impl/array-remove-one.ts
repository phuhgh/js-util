export function arrayRemoveOne<TItem>(items: TItem[], itemToRemove: TItem): void
{
    const index = items.indexOf(itemToRemove);

    if (index === -1)
    {
        return;
    }

    items.splice(index, 1);
}