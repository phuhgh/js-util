export function arrayCopyInto<TItem>(from: ArrayLike<TItem>, to: TItem[]): void
{
    to.length = from.length;

    for (let i = 0, iEnd = to.length; i < iEnd; ++i)
    {
        to[i] = from[i];
    }
}