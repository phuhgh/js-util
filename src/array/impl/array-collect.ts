export function arrayCollect<TRet, TItem>
(
    items: ArrayLike<TItem>,
    collected: TRet,
    collect: (collected: TRet, item: TItem) => void
)
    : TRet
{
    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        collect(collected, items[i]);
    }

    return collected;
}
