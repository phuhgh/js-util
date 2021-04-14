/**
 * @returns A new array with null & undefined removed from items.
 */
export function arrayCompact<TItem>(items: ArrayLike<TItem | null | undefined>): TItem[]
{
    const result: TItem[] = [];

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const item = items[i];

        if (item != null)
        {
            result.push(item);
        }
    }

    return result;
}