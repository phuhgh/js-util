/**
 * @public
 * returns items in A not in B.
 *
 * @remarks
 * See {@link setSetDifference}.
 */
export function setSetDifference<TItem>
(
    a: ReadonlySet<TItem>,
    b: ReadonlySet<TItem>,
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