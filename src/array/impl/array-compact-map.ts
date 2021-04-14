/**
 * Like _Array.map but where the callback returns null it will be omitted from the result.
 */
export function arrayCompactMap<TItem, TTransformed>
(
    items: ArrayLike<TItem>,
    map: (item: TItem, index: number) => TTransformed | null
)
    : TTransformed[]
{
    const mapped: TTransformed[] = [];

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const transformed = map(items[i], i);

        if (transformed !== null)
        {
            mapped.push(transformed);
        }
    }

    return mapped;
}