export function arrayFlatMap<TItem, TTransformed>
(
    items: ArrayLike<TItem>,
    map: (item: TItem) => TTransformed[] | null
)
    : TTransformed[]
{
    const result: TTransformed[] = [];

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const currentResult = map(items[i]);

        if (currentResult == null)
        {
            continue;
        }

        let start = result.length;
        result.length += currentResult.length;

        for (let j = 0, jEnd = currentResult.length; j < jEnd; ++j)
        {
            result[start++] = currentResult[j];
        }
    }

    return result;
}