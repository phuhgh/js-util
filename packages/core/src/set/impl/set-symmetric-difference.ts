/**
 * @public
 *  Returns those items in A not in B, and those items in B not in A.
 * @remarks
 * See {@link setSymmetricDifference}.
 */
export function setSymmetricDifference<TItem>
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

    b.forEach((item) =>
    {
        if (!a.has(item))
        {
            result.push(item);
        }
    });

    return result;
}