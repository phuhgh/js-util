export function arrayForEach<TItem>(items: ArrayLike<TItem>, callback: (item: TItem) => void): void
{
    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        callback(items[i]);
    }
}