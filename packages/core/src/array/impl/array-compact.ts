/**
 * @public
 * Strips null and undefined items from arrays (non mutative).
 *
 * @remarks
 * See {@link arrayCompact}.
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