export function arrayLast<TItem>(items: ArrayLike<TItem>): TItem | undefined
{
    if (items.length === 0)
    {
        return undefined;
    }

    return items[items.length - 1];
}