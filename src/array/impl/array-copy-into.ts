/**
 * @public
 * Make an array contain the same items as another.
 * @param from - The array to copy from.
 * @param to - The array to copy into and resize.
 * @remarks
 * See {@link arrayCopyInto}.
 */
export function arrayCopyInto<TItem>(from: ArrayLike<TItem>, to: TItem[]): void
{
    to.length = from.length;

    for (let i = 0, iEnd = to.length; i < iEnd; ++i)
    {
        to[i] = from[i];
    }
}