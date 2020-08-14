export function arrayMap<TItem, TMapped>(items: TItem[], callback: (item: TItem, index: number) => TMapped): TMapped[]
{
    const mapped = new Array<TMapped>(items.length);

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        mapped[i] = callback(items[i], i);
    }

    return mapped;
}