/**
 * @public
 *
 * @returns items in A not in B.
 */
export function setSetDifference<TItem>
(
    a: Set<TItem>,
    b: Set<TItem>,
)
    : TItem[]
{
    const result: TItem[] = [];

    a.forEach((item) =>
    {
        if (!b.has(item))
        {
            result.push(item);
        }
    });

    return result;
}