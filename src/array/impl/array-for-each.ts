/**
 * @public
 * Like `Array.forEach`.
 * @remarks
 * Has more consistent performance characteristics cross platform than the built in `Array.forEach`.
 *
 * See {@link arrayForEach}.
 */
export function arrayForEach<TItem>(items: ArrayLike<TItem>, callback: (item: TItem, index: number) => void): void
{
    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        callback(items[i], i);
    }
}