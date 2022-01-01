/**
 * @public
 * Iterate over `ArrayLike` calling a callback against it, the callback returns `ArrayLike` which is concatenated into a single `Array`.
 *
 * @param items - The items to iterate over.
 * @param mapCallback - The return from this callback is concatenated to the result, unless null is returned in which case the result is omitted.
 *
 * @returns The output of `mapCallback` flattened into a single array.
 *
 * @remarks
 * See {@link arrayFlatMap}.
 */
export function arrayFlatMap<TItem, TTransformed>
(
    items: ArrayLike<TItem>,
    mapCallback: (item: TItem, index: number) => ArrayLike<TTransformed> | null
)
    : TTransformed[]
{
    const result: TTransformed[] = [];

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const currentResult = mapCallback(items[i], i);

        if (currentResult === null)
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