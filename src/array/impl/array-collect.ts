/**
 * @public
 * Like `Array.reduce` but without the requirement to return the value in the callback.
 *
 * @remarks
 * See {@link arrayCollect}.
 */
export function arrayCollect<TRet, TItem>
(
    items: ArrayLike<TItem>,
    collected: TRet,
    collect: (collected: TRet, item: TItem, index: number) => void
)
    : TRet
{
    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        collect(collected, items[i], i);
    }

    return collected;
}
